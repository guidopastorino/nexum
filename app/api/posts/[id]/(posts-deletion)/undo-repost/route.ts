// /api/posts/[id]/undo-repost
// 'id' es el id del post normal reposteado

// - Al eliminar un post de tipo 'repost':
//  - Busca el post de tipo 'repost' con el repostedFrom: id y el creator: userId (usuario actual logueado)
//  - Elimina del array 'posts' del usuario actualmente logueado el id del post reposteado
//   NOTA: Esta ruta NO ELIMINA el post reposteado original (que es un post del tipo 'normal', es decir), sino que elimina su repost (postToDelete)
// Nota: esta ruta unicamente puede ser llamada al dar click en el botón 'undo-repost'
import { NextResponse } from 'next/server';
import Post from '@/models/Post';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/api/auth-options/authOptions';
import dbConnect from '@/lib/dbConnect';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const repostedPostId = params.id;

    // Buscar el repost a eliminar
    const repostToDelete = await Post.findOne({
      repostedFrom: repostedPostId,
      creator: userId,
      type: 'repost',
    });

    if (!repostToDelete) {
      return NextResponse.json({ error: 'Repost no encontrado' }, { status: 404 });
    }

    // Eliminar el repost
    await Post.deleteOne({ _id: repostToDelete._id });

    // Eliminar del array 'posts' del usuario el ID del repost eliminado
    await User.updateOne(
      { _id: userId },
      { $pull: { posts: repostToDelete._id } }
    );

    // Eliminar del array 'reposts' del post normal reposteado el id del usuario que lo reposteó
    await Post.updateOne(
      { _id: repostedPostId },
      { $pull: { reposts: userId } }
    );

    return NextResponse.json({ message: 'Repost eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el repost:', error);
    return NextResponse.json({ error: 'Error al eliminar el repost' }, { status: 500 });
  }
}