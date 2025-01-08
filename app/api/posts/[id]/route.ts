import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import mongoose, { isValidObjectId, Types } from "mongoose";
import { NextResponse } from "next/server";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { mapPostData } from "@/utils/api/mapPostData";
import { postPopulateOptions } from "@/utils/api/postPopulateOptions";
import { getUserStates } from "@/utils/api/getUserStates";
import { PostPageProps } from "@/types/types";

// Función para obtener datos de un post
// Se obtendrán los datos del post a partir de su 'maskedId'
// 'id' es el maskedId del post
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    await dbConnect();

    const { id } = params;

    const filter = isValidObjectId(id) ? { _id: id } : { maskedId: id }

    const post = await Post
      .findOne(filter)
      .populate(postPopulateOptions);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Obtenemos el array de los posts mapeados (que en este caso será el array con el unico post)
    const enrichedPostArray = await mapPostData([post], userId);

    // Obtenemos el post como objeto accediendo a través del array
    const enrichedPost = enrichedPostArray[0];

    const { isFollowingUser, isFollowedByUser } = await getUserStates(userId, enrichedPost.creator._id.toString());

    (enrichedPost as PostPageProps).isFollowingUser = isFollowingUser;
    (enrichedPost as PostPageProps).isFollowedByUser = isFollowedByUser;

    return NextResponse.json(enrichedPost, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}