import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Feed from "@/models/Feed";
import User from "@/models/User";
import { MongoServerError } from "mongodb";
import { Types } from "mongoose";
import { authOptions } from "@/utils/api/auth-options/authOptions";

// filtrar feeds que creó el usuario o feeds que el usuario sigue
export async function GET(req: Request) {
  try {
    // Conectar a la base de datos
    await dbConnect();

    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);

    // Validar si el usuario está autenticado
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Obtener feeds filtrados directamente desde la base de datos
    const feeds = await Feed.find({
      creator: { $ne: userId }, // Excluir feeds creados por el usuario
      likes: { $nin: [userId] }, // Excluir feeds que el usuario ha likeado
    })
      .populate("creator", "_id username profileImage") // Traer datos del creador
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
        isFeedLiked: false, // Confirmado que no está en los likes
        isFeedCreator: false, // Confirmado que no es el creador
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


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    console.log({ session })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user.id;
    const { title, description, feedPicture, privacy } = await req.json();
    console.log({ title, description, feedPicture, privacy })

    if (!title || !description || !privacy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (description.length > 50) {
      return NextResponse.json(
        { error: "Description exceeds the maximum length of 50 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verificar si ya existe un feed con el mismo título
    const existingFeed = await Feed.findOne({ title });
    if (existingFeed) {
      return NextResponse.json({ error: "Feed title must be unique" }, { status: 400 });
    }

    // Crear el nuevo feed
    const feed = new Feed({
      creator: userId,
      picture: feedPicture,
      title,
      description,
      privacy,
    });

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.feeds = user.feeds || [];
    if (!user.feeds.includes(feed._id)) {
      user.feeds.push(feed._id);
    }

    await feed.save();
    await user.save();

    return NextResponse.json({ message: "Feed created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);

    // Verificar si el error es un error de unicidad
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json({ error: "Feed title already exists" }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}