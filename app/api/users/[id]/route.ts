import mongoose, { Types } from "mongoose";
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