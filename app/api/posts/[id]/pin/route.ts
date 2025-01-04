// /api/posts/[id]/pin

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Post from '@/models/Post';
import { authOptions } from "@/utils/api/auth-options/authOptions";

// Ruta para hacer pin a un post
// Se almacena el id del post en el array 'pinnedPosts' del usuario
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: postId } = params;  // ID del post pasado por parámetros

    console.log({params})

    await dbConnect();

    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id; // ID del usuario autenticado

    // Verificar si el post existe
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Actualizar el array de pinnedPosts del usuario
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Revisar si el post ya está pineado
    const alreadyPinned = user.pinnedPosts.includes(postId);

    if (alreadyPinned) {
      return NextResponse.json({ message: 'Post is already pinned' }, { status: 400 });
    }

    user.pinnedPosts = []

    user.pinnedPosts.push(postId);
    
    await user.save();

    return NextResponse.json({ message: 'Post pinned successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error pinning post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
