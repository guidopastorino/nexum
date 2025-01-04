// /api/users/[id]/posts
// Obtiene los posts de un usuario

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import User from "@/models/User";
import { isValidObjectId, Types } from "mongoose";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { postPopulateOptions, postSelectionFields } from '@/utils/api/postPopulateOptions';
import { mapPostData } from '@/utils/api/mapPostData';

// params.id es el id del creador de los posts
// session.user.id es el id del usuario actualmente logeado
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "No creator id or username provided" }, { status: 400 });
    }

    const filter = isValidObjectId(id) ? { _id: id } : { username: id };
    const user = await User.findOne(filter);

    if (!user) {
      return NextResponse.json({ error: "Post creator not found" }, { status: 404 });
    }

    const postQuery = Post.find({ _id: { $in: user.posts } })
      .skip(skip)
      .limit(pageSize)
      .populate(postPopulateOptions)
      .select(postSelectionFields)
      .sort({ createdAt: -1 });

    if (!userId) {
      postQuery.limit(5);
    }

    const posts = await postQuery.exec();

    const pinnedPostId = user.pinnedPosts.length ? user.pinnedPosts[0].toString() : null;
    if (pinnedPostId) {
      const pinnedPostIndex = posts.findIndex(post => post._id.toString() === pinnedPostId);
      if (pinnedPostIndex !== -1) {
        const [pinnedPost] = posts.splice(pinnedPostIndex, 1);
        posts.unshift(pinnedPost);
      }
    }

    const enrichedPosts = await mapPostData(posts, userId);

    return NextResponse.json(enrichedPosts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}