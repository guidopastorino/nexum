// /api/users/:id/posts
// Obtiene los posts de un usuario

import Post from "@/models/Post";
import User from "@/models/User";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "No creator id or username provided" },
        { status: 400 }
      );
    }

    // Buscar al usuario por ID o username
    const filter = isValidObjectId(id) ? { _id: id } : { username: id };
    const user = await User.findOne(filter);

    if (!user) {
      return NextResponse.json(
        { error: "Post creator not found" },
        { status: 404 }
      );
    }

    // Obtener todos los posts del usuario directamente y ordenarlos
    const posts = await Post.find({ _id: { $in: user.posts } })
      .populate({
        path: "creator",
        select: "_id profileImage fullname username",
      })
      .populate({
        path: "repostedFrom",
        select:
          "_id maskedId creator communityId feedId content likes media type comments quotedPost createdAt",
        populate: [
          {
            path: "creator",
            select: "_id profileImage fullname username",
          },
          {
            path: "quotedPost",
            select: "_id maskedId creator content media createdAt",
            populate: {
              path: "creator",
              select: "_id profileImage fullname username",
            },
          },
        ],
      })
      .populate({
        path: "quotedPost",
        select: "creator maskedId content media createdAt",
        populate: { path: "creator", select: "_id profileImage fullname username" },
      })
      .populate({
        path: "comments",
        select: "_id content createdAt",
        model: "Comment",
      })
      .select("_id maskedId content media likes type createdAt communityId feedId")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}