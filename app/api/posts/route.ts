import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import '@/models/';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    const posts = await Post.find()
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: 'creator',
        select: '_id profileImage fullname username',
      })
      .populate({
        path: 'repostedFrom',
        select: '_id creator communityId feedId content tags likes media type comments views createdAt quotedPost',
        populate: [
          {
            path: 'creator',
            select: '_id profileImage fullname username'
          },
          {
            path: 'quotedPost',
            select: '_id creator content media createdAt',
            populate: {
              path: 'creator',
              select: '_id profileImage fullname username'
            }
          }
        ]
      })
      .populate({
        path: 'quotedPost',
        select: 'creator content media createdAt',
        populate: { path: 'creator', select: '_id profileImage fullname username' },
      })
      .populate({
        path: 'comments',
        select: '_id content createdAt',
        model: 'Comment',
      })
      .select('content media likes views type createdAt communityId feedId tags')
      .sort({ createdAt: -1 });



    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los posts' }, { status: 500 });
  }
}