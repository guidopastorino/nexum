// Ruta para registrar a un usuario con sus credenciales
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    await dbConnect()

    const { fullname, username, email, password, profileImage, bannerImage } = await req.json()

    // Verificar si están todos los datos
    if (!fullname || !username || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Verificar si el usuario o el email ya existen
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return NextResponse.json({ error: 'El usuario o el email ya están registrados' }, { status: 400 });
    }

    // Crear el nuevo usuario (mandamos la contraseña a texto plano ya que el metodo en 'presave' de User se encargará de hashearla)
    const newUser = new User({ fullname, username, email, password, profileImage, bannerImage });
    await newUser.save();

    return NextResponse.json({ message: 'Usuario creado con éxito' }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json({ error: 'Error al registrar el usuario' }, { status: 500 });
  }
}