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
  bannerImage: string | null;
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
  const userId = url.searchParams.get("userId");

  try {
    await dbConnect();

    if (!id) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const query = mongoose.Types.ObjectId.isValid(id) 
      ? { _id: new mongoose.Types.ObjectId(id) } 
      : { username: id };

    const userData = await User.aggregate([
      { $match: query },
      {
        $addFields: {
          isFollowingUser: userId && mongoose.Types.ObjectId.isValid(userId)
            ? {
                $in: [new mongoose.Types.ObjectId(userId), "$followers"],
              }
            : false, // Si userId no es válido, asumimos que no está siguiendo
        },
      },
      {
        $project: {
          _id: 1,
          fullname: 1,
          username: 1,
          isVerified: 1,
          profileImage: 1,
          bannerImage: 1,
          createdAt: 1,
          updatedAt: 1,
          postsCount: { $size: "$posts" },
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
          isFollowingUser: 1,
        },
      },
    ]);

    if (!userData || userData.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
  }
}