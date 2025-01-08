import dbConnect from "@/lib/dbConnect";
import { Post, User } from "@/models";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { isValidObjectId, Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// /api/posts/[id]/delete-post
// - Elimina un post de tipo 'normal':
// 'id' es el id del post a eliminar
// - Busca el post en la bd y lo elimina
// - Elimina del array 'posts' del usuario actualmente logueado el id del post a eliminar
// - Del array 'reposts' del post a eliminar, elimina esos posts (los cuales, su propiedad repostedFrom debe ser el id del post normal eliminado)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await dbConnect();

    const { id } = params;
    const filter = isValidObjectId(id) ? { _id: id } : { maskedId: id };
    const postToDelete = await Post.findOneAndDelete(filter);

    if (!postToDelete) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Eliminamos los reposts asociados al post original
    const repostsToDelete = await Post.find({ repostedFrom: postToDelete._id });
    await Post.deleteMany({ repostedFrom: postToDelete._id });
    await User.updateOne(
      { _id: userId },
      { $pull: { posts: { $in: repostsToDelete.map(repost => repost._id) } } }
    );

    const user = await User.findById(userId);

    // Eliminamos el post reposteado del array de posts del usuario
    if (user) {
      user.posts = user.posts.filter((postId: Types.ObjectId) => postId.toString() !== postToDelete._id.toString());
      await user.save();
    }

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}