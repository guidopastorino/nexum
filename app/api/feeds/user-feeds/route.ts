import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Feed from "@/models/Feed";
import { Types } from "mongoose";

// devuelve los feeds del usuario actual logeado
// feeds que el usuario creó o sigue
export async function GET(req: Request, res: Response) {
  try {
    // Obtener la sesión del usuario logeado
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Conectar a la base de datos
    await dbConnect();

    // Obtener los feeds que el usuario creó o sigue
    const feeds = await Feed.find({
      $or: [
        { creator: userId }, // Feeds creados por el usuario
        { likes: { $in: [userId] } }, // Feeds que el usuario ha seguido (liked)
      ],
    })
      .populate("creator", "_id username profileImage") // Traer datos del creador del feed
      .select("-__v") // Excluir el campo __v de Mongoose
      .lean();

    // Crear un array con la información necesaria para cada feed
    const feedItems = feeds.map((feed: any) => {
      const likedByCount = feed.likes ? feed.likes.length : 0;

      return {
        creatorId: (feed.creator._id as Types.ObjectId).toString(),
        creatorUsername: feed.creator.username,
        creatorProfileImage: feed.creator.profileImage,
        feedId: feed._id,
        feedMaskedId: feed.maskedId,
        feedTitle: feed.title,
        feedImage: feed.picture,
        feedDescription: feed.description,
        likedByCount: likedByCount,
        isFeedLiked: feed.likes?.map(String).includes(userId),  // si el usuario sigue o no el feed (si es el creador del feed, entonces esta propiedad es true, ya que es el que lo creó)
        isFeedCreator: feed.creator._id.toString() === userId, // Verificar si el usuario es el creador
      };
    });

    // Respuesta exitosa con la lista de feed items
    return NextResponse.json(feedItems, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}