// pages/api/posts/[id]/unbookmark.ts
import { getServerSession } from 'next-auth';
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';
import { ObjectId } from 'mongodb';  // Asegúrate de importar ObjectId de MongoDB

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // ID del post
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await dbConnect();

    // Verificar si el post existe
    const post = await Post.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Verificar si el post ya tiene el bookmark
    if (!post.bookmarks.includes(userId)) {
      return NextResponse.json({ message: 'Bookmark not found' }, { status: 400 });
    }

    // Actualizar el post eliminando el ID del usuario de bookmarks
    await Post.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { bookmarks: userId } }
    );

    // Actualizar el usuario eliminando el ID del post de bookmarkedPosts
    await User.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { bookmarkedPosts: id } }
    );

    return NextResponse.json({ message: 'Bookmark removed' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}