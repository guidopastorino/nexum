import { PostCreationProps } from "@/components/CreatePostFixedButton";
import { IUser, PostProps } from "@/types/types";
import ky, { HTTPError } from "ky"

// the main feed algorithm
export const fetchPosts = async (page: number, pageSize: number, userId: string | null): Promise<PostProps[]> => {
  try {
    console.log({ userId })
    const url = new URL(`${window.location.origin}/api/posts?page=${page}&pageSize=${pageSize}`);

    // Si existe el userId, lo agregas como parámetro de la URL
    if (userId) {
      url.searchParams.append('userId', userId);
    }

    const response = await ky.get(url.toString());
    return await response.json();
  } catch (error) {
    if (error instanceof HTTPError) {
      const status = error.response.status;

      if (status === 404) {
        console.warn("No se encontraron posts disponibles.");
        return []; // Retornamos un array vacío en caso de 404
      }

      console.error(`Error HTTP: ${status}`);
    } else {
      console.error("Error al realizar la solicitud:", error);
    }

    throw new Error("No se pudieron cargar los posts. Intente más tarde.");
  }
};

export const getUserData = async (userId: string): Promise<IUser | null> => {
  try {
    const res = await ky.get(`/api/users/${userId}`).json<IUser>();
    console.log("Usuario obtenido:", res);
    return res;
  } catch (error) {
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

// create a 'normal' post
export const createPost = async ({ creator, content, media, type }: PostCreationProps) => {
  try {
    const res = await ky.post("/api/posts", { json: { creator, content, media, type } });
    if (!res.ok) {
      console.error(`Error: ${res.statusText}`);
      const errorData = await res.json();
      console.error(errorData);
      return errorData
    } else {
      const data = await res.json();
      console.log(data);
      return data
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

// Gets all the posts from a user
// 'creator' could be the _id or username
export const getUserPosts = async (creator: string): Promise<PostProps[]> => {
  try {
    const res = await ky.get(`/api/users/${creator}/posts`);
    if (!res.ok) {
      console.error(`Error: ${res.statusText}`);
      const errorData = await res.json();
      console.error(errorData);
      return [];
    } else {
      const data = await res.json();
      return data as PostProps[];
    }
  } catch (error) {
    console.error("Network error:", error);
    return [];
  }
}

// ======= POST OPTIONS FUNCTIONS =======
interface DeletePostResponse {
  message?: string;
  error?: string;
}

export const deletePost = async (postId: string): Promise<string> => {
  try {
    const res = await ky.delete(`/api/posts/${postId}`);

    if (res.ok) {
      const data: DeletePostResponse = await res.json(); // Aserción de tipo
      console.log("Post deleted successfully:", data);
      return data.message || "Post deleted successfully"; // Mensaje de éxito
    } else {
      const errorData: DeletePostResponse = await res.json(); // Aserción de tipo
      console.error("Error deleting post:", errorData);
      return errorData.error || "Error desconocido al eliminar el post"; // Error al eliminar el post
    }
  } catch (error) {
    console.error("Network error:", error);
    return "Error al eliminar el post: " + (error instanceof Error ? error.message : "Desconocido");
  }
};