import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { getUserStates } from "@/utils/api/getUserStates";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params; // ID o username del usuario
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Buscar al usuario por _id o username
    const filter = isValidObjectId(id) ? { _id: id } : { username: id };
    const user = await User.findOne(filter);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Poblar los usuarios seguidos por el usuario
    const userFollowingList = await User.find({ _id: { $in: user.following } })
      .select("_id profileImage fullname username isVerified description")
      .exec();

    // Agregar los estados isFollowingUser e isFollowedByUser
    const followsWithStates = await Promise.all(
      userFollowingList.map(async (follow) => {
        const { isFollowingUser, isFollowedByUser } = await getUserStates(userId, follow._id.toString());
        return { ...follow.toObject(), isFollowingUser, isFollowedByUser };
      })
    );

    // Retornar la lista de usuarios seguidos con estados
    return NextResponse.json(followsWithStates, { status: 200 });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 }
    );
  }
}