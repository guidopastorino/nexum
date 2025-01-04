// /api/users/[id]/likes

import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { mapPostData } from "@/utils/api/mapPostData";
import { postPopulateOptions, postSelectionFields } from "@/utils/api/postPopulateOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Obtiene los posts likeados de un usuario
// 'id' es el username del usuario
// devuelve una paginación
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const userId = session.user.id

    await dbConnect();

    const { id } = params;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const user = await User.findOne({ username: id })
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: "likes",
        select: postSelectionFields,
        populate: postPopulateOptions,
      });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const likedPostsArray = user.likes;

    // for states
    const enrichedLikedPosts = await mapPostData(likedPostsArray, userId);

    return NextResponse.json(enrichedLikedPosts, { status: 200 });
  } catch (error) {
    console.log(error);
    // En caso de error, se devuelve un mensaje de error
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}