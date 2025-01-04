import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getUserStates } from "@/utils/api/getUserStates";
import { isValidObjectId } from "mongoose";
import { authOptions } from "@/utils/api/auth-options/authOptions";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const filter = isValidObjectId(id) ? { _id: id } : { username: id };
    const user = await User.findOne(filter);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userFollowersList = await User.find({ _id: { $in: user.followers } })
      .select("_id profileImage fullname username isVerified description")
      .exec();

    const followersWithStates = await Promise.all(
      userFollowersList.map(async (follower) => {
        const { isFollowingUser, isFollowedByUser } = await getUserStates(userId, follower._id.toString());
        return { ...follower.toObject(), isFollowingUser, isFollowedByUser };
      })
    );

    return NextResponse.json(followersWithStates, { status: 200 });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
  }
}