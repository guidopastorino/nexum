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

// params.id es el id o username del creador de los posts
// session.user.id es el id del usuario actualmente logueado
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

    const pinnedPostId = user.pinnedPosts.length ? user.pinnedPosts[0] : null;
    let pinnedPost = null;

    // Busca el pinned post directamente antes de la paginación
    if (pinnedPostId) {
      pinnedPost = await Post.findById(pinnedPostId)
        .populate(postPopulateOptions)
        .select(postSelectionFields)
        .exec();
    }

    // Excluye el pinned post de la consulta paginada
    const postQuery = Post.find({
      _id: { $in: user.posts, $ne: pinnedPostId },
    })
      .skip(skip)
      .limit(pageSize)
      .populate(postPopulateOptions)
      .select(postSelectionFields)
      .sort({ createdAt: -1 });

    if (!userId) {
      postQuery.limit(5);
    }

    const posts = await postQuery.exec();
    const finalPosts = pinnedPost && page === 1 ? [pinnedPost, ...posts] : posts;
    const enrichedPosts = await mapPostData(finalPosts, userId);

    return NextResponse.json(enrichedPosts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}