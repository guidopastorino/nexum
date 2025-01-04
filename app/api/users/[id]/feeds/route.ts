// /api/users/[id]/feeds
import mongoose, { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { Feed, User } from "@/models";
import { NextResponse } from "next/server";
import { FeedItemProps } from "@/types/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/api/auth-options/authOptions";

// Devuelve los feeds que se encuentran en el array "feeds" del usuario
// 'id' puede ser el _id del usuario o el username
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Extraer el id del parámetro
    const { id } = params;
    
    console.log({params: params.id})

    const session = await getServerSession(authOptions)
    const userId = session?.user.id

    // Verificar si el id es un ObjectId válido de MongoDB o un username
    const filter = Types.ObjectId.isValid(id) ? { _id: id } : { username: id };

    // Conectar a la base de datos
    await dbConnect();

    // Buscar el usuario en la base de datos
    const user = await User.findOne(filter);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Obtener los feeds del usuario
    const feeds = await Feed.find({
      _id: { $in: user.feeds }, // Buscar los feeds cuyo id esté en el array "feeds" del usuario
    })
      .populate("creator", "_id username profileImage") // Popula los datos del creador del feed
      .select("-__v"); // Excluye el campo "__v"

    // Formatear los feeds de acuerdo a FeedItemProps
    const feedItems: FeedItemProps[] = feeds.map((feed: any) => {
      const isFeedCreator = feed.creator._id.toString() === user._id.toString();

      return {
        creatorId: feed.creator._id.toString(),
        creatorUsername: feed.creator.username,
        creatorProfileImage: feed.creator.profileImage || "",
        feedId: feed._id.toString(),
        feedMaskedId: feed.maskedId,
        feedTitle: feed.title,
        feedImage: feed.picture,
        feedDescription: feed.description,
        likedByCount: feed.likes ? feed.likes.length : 0,
        isFeedLiked: feed.likes?.map(String).includes(userId),  // si el usuario sigue o no el feed (si es el creador del feed, entonces esta propiedad es true, ya que es el que lo creó)
        isFeedCreator: feed.creator._id.toString() === userId, // Verificar si el usuario es el creador
      };
    });

    // Responder con los feeds formateados
    return NextResponse.json(feedItems, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}