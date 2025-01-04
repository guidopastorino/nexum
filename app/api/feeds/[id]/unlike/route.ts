// /api/feeds/[id]/unlike
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Feed from "@/models/Feed";

// Elimina un like de un feed usando el ID del usuario logueado. 
// Verifica que el feed exista y guarda los cambios en la base de datos.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Feed ID is required" }, { status: 400 });
    }

    const userId = session.user.id;

    await dbConnect();

    const feed = await Feed.findOne({ maskedId: id });

    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    const likeIndex = feed.likes.indexOf(userId);

    if (likeIndex !== -1) {
      feed.likes.splice(likeIndex, 1); // Eliminar el userId de los likes
      await feed.save();
    }

    return NextResponse.json({ message: "Feed unliked successfully", feed }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}