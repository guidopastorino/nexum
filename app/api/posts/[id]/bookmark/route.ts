// pages/api/posts/[id]/bookmark.ts
import { getServerSession } from 'next-auth';
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';
import { ObjectId } from 'mongodb';  // Asegúrate de importar ObjectId de MongoDB

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // ID del post
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await dbConnect();

    // Verificar si el post existe
    const post = await Post.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Verificar si el post ya está marcado
    if (post.bookmarks.includes(userId)) {
      return NextResponse.json({ message: 'Already bookmarked' }, { status: 400 });
    }

    // Actualizar el post agregando el ID del usuario a bookmarks
    await Post.updateOne(
      { _id: new ObjectId(id) },
      { $push: { bookmarks: userId } }
    );

    // Actualizar el usuario agregando el ID del post a bookmarkedPosts
    await User.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { bookmarkedPosts: id } }
    );

    return NextResponse.json({ message: 'Bookmark added' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
