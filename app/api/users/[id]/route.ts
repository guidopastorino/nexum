import mongoose, { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { User, Post } from "@/models";
import { NextResponse } from "next/server";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { getServerSession } from "next-auth";
import { getUserStates } from "@/utils/api/getUserStates";

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
      .populate("followers", "_id")
      .populate("following", "_id")
      .populate("posts", "_id")
      .lean();

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { isFollowingUser, isFollowedByUser } = await getUserStates(userId, userData._id.toString());

    const response = {
      ...userData,
      _id: userData._id.toString(),
      postsCount: userData.posts.length || 0,
      followersCount: userData.followers.length || 0,
      followingCount: userData.following.length || 0,
      isFollowingUser,
      isFollowedByUser,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
  }
}
