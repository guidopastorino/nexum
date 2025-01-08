import dbConnect from "@/lib/dbConnect";
import { Post, User } from "@/models";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// DELETE /api/posts/[id]/unquote (para deshacer quote)
// 'id' es el id del post quoteado
// - Al eliminar un post de tipo 'quote':
//   - Elimina del array 'posts' del usuario actualmente logueado el id del post a eliminar
//   - Busca en la bd el postToDelete.quotedPost y a ese post, en su array 'quotes' le elimina el id del postToDelete
//   - Del array 'reposts' del post a eliminar, elimina esos posts (los cuales, su propiedad repostedFrom debe ser el id del post normal 
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    await dbConnect();

    const { id } = params;
    const postToDelete = await Post.findOne({ _id: id, creator: userId, type: 'quote' });

    if (!postToDelete) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Eliminar el ID del post a eliminar del array 'quotes' del post original citado
    await Post.updateOne(
      { _id: postToDelete.quotedPost },
      { $pull: { quotes: postToDelete._id } }
    );

    // Eliminar reposts relacionados con el post de tipo 'quote'
    await Post.deleteMany({ repostedFrom: postToDelete._id });

    // Eliminar el post de tipo 'quote'
    await Post.deleteOne({ _id: postToDelete._id });

    // Eliminar el ID del post a eliminar del array 'posts' del usuario actual
    await User.updateOne(
      { _id: userId },
      { $pull: { posts: postToDelete._id } }
    );

    return NextResponse.json({ message: "Quote removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el quote:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}