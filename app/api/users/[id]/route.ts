import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { IUser } from "@/types/types";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    let user = null;

    await dbConnect();

    // Try searching user by _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id)
        .select("_id fullname username email profileImage createdAt updatedAt")
        .lean<IUser>();
    }

    // If there is no user, find by username
    if (!user) {
      user = await User.findOne({ username: id })
        .select("_id fullname username email profileImage createdAt updatedAt")
        .lean<IUser>();
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching user", error }), { status: 500 });
  }
}