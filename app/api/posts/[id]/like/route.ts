import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/utils/api/auth-options/authOptions";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    // Obtener la sesión del usuario actual
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const postId = params.id;
    const userId = session.user.id;

    // Buscar el post y el usuario
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
      return NextResponse.json({ message: 'Post or User not found' }, { status: 404 });
    }

    // Verificar si el usuario ya dio like al post o si el post ya tiene el like del usuario
    if (user.likes.includes(postId) || post.likes.includes(userId)) {
      return NextResponse.json({ message: 'Already liked' }, { status: 400 });
    }

    // Agregar el like en el post y en el usuario
    post.likes.push(userId);    // Se agrega el id del usuario al final de los likes del post
    user.likes.unshift(postId); // Se agrega el like del post al inicio de los likes del usuario

    await post.save();
    await user.save();

    return NextResponse.json({ message: 'Post liked successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error liking post' }, { status: 500 });
  }
}