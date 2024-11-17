import mongoose, { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

// route response
interface IUser extends Document {
  _id: string;
  fullname: string;
  username: string;
  isVerified: boolean;
  profileImage: string | null;
  following: Types.ObjectId[]; // Usuarios seguidos
  followers: Types.ObjectId[]; // Usuarios seguidores
  posts: Types.ObjectId[]; // Posts creados por el usuario
  likes: Types.ObjectId[]; // Posts que ha dado like
  createdAt: Date;
  updatedAt: Date;
}

// 'id' es el id del usuario a obtener los datos
// 'userId' es el id del usuario actualmente logeado, sirve para ver si el usuario logeado lo sigue, etc...

export async function GET(req: Request, { params }: { params: { id: string } }, res: Response) {
  const { id } = params;
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  try {
    let user = null;
    await dbConnect();

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id)
        .select("_id fullname username isVerified profileImage createdAt updatedAt following followers posts likes")
        .lean<IUser>();
    }

    if (!user) {
      user = await User.findOne({ username: id })
        .select("_id fullname username isVerified profileImage createdAt updatedAt following followers posts likes")
        .lean<IUser>();
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verificamos si el usuario logueado sigue al creador
    const isFollowingUser: boolean = userId ? user.followers.includes(userId as any) : false;

    // Calculamos las métricas de conteo
    const postsCount = user.posts.length;
    const followersCount = user.followers.length;
    const followingCount = user.following.length;

    // Creamos un objeto sin los campos que no deseas enviar
    const userData = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      isVerified: user.isVerified,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      postsCount,
      followersCount,
      followingCount,
      isFollowingUser: isFollowingUser ?? false,
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
  }
}