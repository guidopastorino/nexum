import { IUser } from "@/types/types";
import ky from "ky"

export const getUserData = async (userId: string): Promise<IUser | null> => {
  try {
    const res = await ky.get(`/api/users/${userId}`).json<IUser>();
    console.log("Usuario obtenido:", res);
    return res;
  } catch (error) {
    console.error("Error obteniendo los datos del usuario:", error);
    return null;
  }
};