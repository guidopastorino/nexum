import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

// Función para obtener datos de un post (recordemos que un comentario (reply) también es un post)
// Se obtendrán los datos del post a partir de su 'maskedId'
// 'id' es el maskedId del post (por ahora, sino se buscará por su _id)
export async function GET(req: Request, { params }: { params: { id: string } }, res: Response) {
  try {
    await dbConnect()

    const { id } = params

    const post = await Post.findOne({ maskedId: id })
      .populate({
        path: 'creator',
        select: '_id profileImage fullname username'
      })
      .populate({
        path: 'quotedPost',
        select: 'creator maskedId content media createdAt',
        populate: { path: 'creator', select: '_id profileImage fullname username' },
      })
      .populate({
        path: 'comments',
        select: '_id content createdAt',
        model: 'Comment',
      })
      .select({
        _id: 1,
        maskedId: 1,
        content: 1,
        media: 1,
        type: 1,
        createdAt: 1,
        communityId: 1,
        feedId: 1,
        likes: { $size: "$likes" },
      })
      .lean()

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;

    // Verificar si el id es válido
    const filter = isValidObjectId(id) ? { _id: id } : { maskedId: id };

    const result = await Post.findOneAndDelete(filter);

    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}