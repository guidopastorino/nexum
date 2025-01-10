import mongoose, { isValidObjectId, Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { getServerSession } from "next-auth";
import { getUserStates } from "@/utils/api/getUserStates";
import FeedModel from "@/models/Feed";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  try {
    await dbConnect();

    const query = Types.ObjectId.isValid(id)
      ? { _id: new Types.ObjectId(id) }
      : { username: id };

    const userData: any = await User.findOne(query)
      .select('_id fullname username isVerified profileImage bannerImage description')
      .lean();

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Contar documentos sin hacer populate
    const postsCount = await Post.countDocuments({ creator: userData._id });
    const feedsCount = await FeedModel.countDocuments({ creator: userData._id });
    const likesCount = await Post.countDocuments({ likes: userData._id });
    const followersCount = await User.countDocuments({ following: userData._id });
    const followingCount = await User.countDocuments({ followers: userData._id });

    const { isFollowingUser, isFollowedByUser } = await getUserStates(userId, userData._id.toString());

    const response = {
      _id: userData._id.toString(),
      fullname: userData.fullname,
      username: userData.username,
      isVerified: userData.isVerified,
      profileImage: userData.profileImage,
      bannerImage: userData.bannerImage,
      description: userData.description,
      postsCount,
      repliesCount: 0,
      mediaCount: 0,
      feedsCount,
      likesCount,
      communitiesCount: 0,
      followersCount,
      followingCount,
      isFollowingUser,
      isFollowedByUser,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
  }
}

// PUT /api/users
// Update user's profile
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { fullname, username, description, profileImage, bannerImage } = await req.json()

    await dbConnect()

    const filter = isValidObjectId(id) ? { _id: id } : { username: id }

    const user = await User.findOne(filter)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verificar si el usuario es el mismo que está haciendo la solicitud (asegurando la seguridad)
    if (user._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Actualizar los campos del usuario
    const updatedUser = await User.updateOne(
      filter,
      {
        $set: {
          fullname,
          username,
          description,
          profileImage,
          bannerImage
        }
      }
    )

    // Si la actualización no afectó a ningún documento
    if (updatedUser.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 400 })
    }

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}