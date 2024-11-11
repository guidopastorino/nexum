import { IUser } from "@/types/types";
import ky from "ky"

export const getUserData = async (userId: string): Promise<IUser | null> => {
  try {
    const res = await ky.get(`/api/users/${userId}`).json<IUser>();
    console.log("Usuario obtenido:", res);
    return res;
  } catch (error) {
    console.error();
    return null;
  }
};

export const createUser = async ({
  userData,
}: {
  userData: { fullname: string; username: string; email: string; password: string };
}): Promise<string> => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    const res = await fetch("/api/auth/register", options);

    const data = await res.json();

    if (res.ok) {
      return data.message; // Retorna el mensaje del servidor si la respuesta es exitosa
    } else {
      return data.error || "Error desconocido"; // Retorna el error del servidor o un mensaje genérico
    }
  } catch (error) {
    // En caso de error, lanzar el error con un mensaje genérico
    return "Error al registrar el usuario: " + (error instanceof Error ? error.message : "Desconocido");
  }
};
