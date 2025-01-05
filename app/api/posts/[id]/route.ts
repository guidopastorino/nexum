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

    (enrichedPost as PostPageProps).isFollowingUser = isFollowingUser;
    (enrichedPost as PostPageProps).isFollowedByUser = isFollowedByUser;

    return NextResponse.json(enrichedPost, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────────────────────────


// Ruta: /api/posts/[id] (DELETE para manejar todos los tipos de posts)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  await dbConnect();

  const { id } = params;
  const filter = isValidObjectId(id) ? { _id: id } : { maskedId: id };
  const postToDelete = await Post.findOne(filter);

  if (!postToDelete) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (postToDelete.type === 'normal') {
    // Eliminar posts que repostean este post (posts de tipo 'repost' que su array 'repostedFrom' tienen el id de este post)
    await Post.deleteMany({ type: 'repost', repostedFrom: postToDelete._id });
  } else if (postToDelete.type === 'repost') {
    if (postToDelete.creator.toString() === userId) {
      // Eliminar el post reposteado completo
      await handleDeleteRepost(postToDelete.repostedFrom.toString(), userId, postToDelete._id.toString());
    } else {
      // Deshacer repost sin eliminar el post actual
      await handleUndoRepost(postToDelete.repostedFrom.toString(), userId);
    }
  } else if (postToDelete.type === 'quote') {
    await handleRemoveQuote(postToDelete.quotedPost.toString(), postToDelete._id.toString());
  }

  await Post.deleteOne({ _id: postToDelete._id });

  // Reorganizar los posts del usuario, eliminando el post eliminado del array 'posts'
  const user = await User.findById(userId);
  if (user) {
    user.posts = user.posts.filter((postId: Types.ObjectId) => postId.toString() !== postToDelete._id.toString());
    await user.save();
  }

  return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
}

async function handleDeleteRepost(repostedFromId: string, userId: string, repostId: string) {
  const repostedPost = await Post.findById(repostedFromId);
  if (repostedPost) {
    repostedPost.reposts = repostedPost.reposts.filter((uid: Types.ObjectId) => uid.toString() !== userId);
    await repostedPost.save();
  }
}

async function handleUndoRepost(repostedFromId: string, userId: string) {
  const repostedPost = await Post.findById(repostedFromId);
  if (repostedPost) {
    repostedPost.reposts = repostedPost.reposts.filter((uid: Types.ObjectId) => uid.toString() !== userId);
    await repostedPost.save();
  }
}

async function handleRemoveQuote(quotedPostId: string, quoteId: string) {
  const quotedPost = await Post.findById(quotedPostId);
  if (quotedPost) {
    quotedPost.quotes = quotedPost.quotes.filter((qid: Types.ObjectId) => qid.toString() !== quoteId);
    await quotedPost.save();
  }
}