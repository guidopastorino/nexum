import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import mongoose, { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { mapPostData } from "@/utils/api/mapPostData";
import { postPopulateOptions } from "@/utils/api/postPopulateOptions";
import { getUserStates } from "@/utils/api/getUserStates";

// Función para obtener datos de un post
// Se obtendrán los datos del post a partir de su 'maskedId'
// 'id' es el maskedId del post
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    await dbConnect();

    const { id } = params;

    const post = await Post
      .findOne({ maskedId: id })
      .populate(postPopulateOptions);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Obtenemos el array de los posts mapeados (que en este caso será el array con el unico post)
    const enrichedPostArray = await mapPostData([post], userId);

    // Obtenemos el post como objeto accediendo a través del array
    const enrichedPost = enrichedPostArray[0];

    const { isFollowingUser, isFollowedByUser } = await getUserStates(userId, enrichedPost.creator._id.toString());

    enrichedPost.isFollowingUser = isFollowingUser;
    enrichedPost.isFollowedByUser = isFollowedByUser;

    return NextResponse.json(enrichedPost, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    const userId = session.user.id;

    await dbConnect();

    const { id } = params;

    // Verificar si el ID es válido
    const filter = isValidObjectId(id) ? { _id: id } : { maskedId: id };

    const postToDelete = await Post.findOne(filter);

    if (!postToDelete) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Lógica para eliminar según el tipo de post
    if (postToDelete.type === "normal") {
      // Eliminar reposts relacionados
      await Post.deleteMany({ repostedFrom: postToDelete._id });
    }

    // Eliminar el post principal (normal, repost, o quote)
    await Post.deleteOne({ _id: postToDelete._id });

    // Eliminar el post de la lista del usuario
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "Post author not found" }, { status: 404 });
    }

    user.posts = user.posts.filter(
      (postId: mongoose.Types.ObjectId) => !postId.equals(postToDelete._id)
    );

    await user.save();

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}