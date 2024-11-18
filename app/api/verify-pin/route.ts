import dbConnect from "@/lib/dbConnect";
import EmailVerificationPin from "@/models/EmailVerificationPin";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    await dbConnect()

    const { email, pin } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!pin) {
      return NextResponse.json({ error: "Pin is required" }, { status: 400 });
    }

    // Buscar el documento en la base de datos
    const verificationPin = await EmailVerificationPin.findOne({ email, pin });

    // Si no se encuentra
    if (!verificationPin) {
      return NextResponse.json({ error: "Invalid email or pin" }, { status: 404 });
    }

    // Si ya está verificado
    if (verificationPin.verified) {
      return NextResponse.json({ message: "This email has already been verified. No further action is required" }, { status: 400 });
    }

    // Marcar como verificado
    verificationPin.verified = true;
    await verificationPin.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}