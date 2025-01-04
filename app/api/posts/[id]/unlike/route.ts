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

    console.log({session})

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

    // Verificar si el usuario ya no ha dado like al post o si el post no tiene el like del usuario
    if (!user.likes.includes(postId) || !post.likes.includes(userId)) {
      return NextResponse.json({ message: 'Not liked yet' }, { status: 400 });
    }

    // Eliminar el like en el post y en el usuario
    post.likes.pull(userId);
    user.likes.pull(postId);

    await post.save();
    await user.save();

    return NextResponse.json({ message: 'Post unliked successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error unliking post' }, { status: 500 });
  }
}
