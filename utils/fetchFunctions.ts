import { PostCreationProps } from "@/components/CreatePostFixedButton";
import { FollowData, IUser, PostPageProps, PostProps, UpdateUserData, UserProfile } from "@/types/types";
import ky, { HTTPError } from "ky"

// the main feed algorithm
export const fetchPosts = async (page: number, pageSize: number): Promise<PostProps[]> => {
  try {
    const url = new URL(`${window.location.origin}/api/posts?page=${page}&pageSize=${pageSize}`);

    const response = await ky.get(url.toString());
    return await response.json();
  } catch (error) {
    if (error instanceof HTTPError) {
      const status = error.response.status;

      if (status === 404) {
        console.warn("No se encontraron posts disponibles.");
        return [];
      }

      console.error(`Error HTTP: ${status}`);
    } else {
      console.error("Error al realizar la solicitud:", error);
    }

    throw new Error("No se pudieron cargar los posts. Intente más tarde.");
  }
};

export const getUserData = async (userId: string): Promise<UserProfile | null> => {
  try {
    const res = await ky.get(`/api/users/${userId}`).json<UserProfile>();
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

// Updates a user's basic profile info
// PUT /api/users, { fullname, username, profileImage, bannerImage }
export const updateUser = async (id: string, data: UpdateUserData): Promise<any> => {
  try {
    const updatedUser = await ky.put(`/api/users/${id}`, {
      json: data,
    }).json();

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

// create a 'normal' post
export const createPost = async ({ content, media, type }: PostCreationProps) => {
  try {
    const res = await ky.post("/api/posts", { json: { content, media, type } });
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

// Get the data of a post
export const getPostData = async (postId: string): Promise<PostPageProps | null> => {
  try {
    // Usamos ky para hacer una solicitud GET y obtener los datos en formato JSON.
    const data: PostPageProps = await ky.get(`/api/posts/${postId}`).json();

    return data;
  } catch (error) {
    console.error("Error fetching post data:", error);
    return null;
  }
};

// Gets all the posts from a user
// 'creator' could be the _id or username
// pagination responses
export const getUserPosts = async (
  creator: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PostProps[]> => {
  try {
    const url = new URL(
      `${window.location.origin}/api/users/${creator}/posts?page=${page}&pageSize=${pageSize}`
    );
    const res = await fetch(url.toString());

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error fetching posts:", errorData.message);
      throw new Error(errorData.message || "Failed to fetch user posts.");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Network or server error:", error);
    return [];
  }
};

// Gets all the posts liked from a user
// 'creator' could be the _id or username
// pagination responses
export const getUserLikes = async (
  creator: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PostProps[]> => {
  try {
    const url = new URL(
      `${window.location.origin}/api/users/${creator}/likes?page=${page}&pageSize=${pageSize}`
    );
    const res = await fetch(url.toString());

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error fetching liked posts:", errorData.message);
      throw new Error(errorData.message || "Failed to fetch user liked posts.");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Network or server error:", error);
    return [];
  }
};

// Get a list of followers from a user
// GET /api/users/[id]/followers
export const getUserFollowers = async (userId: string): Promise<FollowData[]> => {
  try {
    const res = await ky.get(`/api/users/${userId}/followers`).json<FollowData[]>();
    console.log("followers: ", res);
    return res;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw new Error('Could not fetch followers');
  }
};

// Get a list of followers from a user
// GET /api/users/[id]/following
export const getUserFollowing = async (userId: string): Promise<FollowData[]> => {
  try {
    const res = await ky.get(`/api/users/${userId}/following`).json<FollowData[]>();
    return res;
  } catch (error) {
    console.error('Error fetching following:', error);
    throw new Error('Could not fetch following');
  }
};

// ======= POST OPTIONS FUNCTIONS =======
interface DeletePostResponse {
  message?: string;
  error?: string;
}

// Delete a normal post
export const deleteNormalPost = async (postId: string): Promise<string> => {
  try {
    const res = await ky.delete(`/api/posts/${postId}/delete-post`);

    if (res.ok) {
      const data: DeletePostResponse = await res.json();
      return data.message || "Post deleted successfully";
    } else {
      const errorData: DeletePostResponse = await res.json();
      console.error("Error deleting post:", errorData);
      return errorData.error || "Error desconocido al eliminar el post";
    }
  } catch (error) {
    console.error("error:", error);
    return "Error al eliminar el post: " + (error instanceof Error ? error.message : "Unknown");
  }
};

// Delete a quote post
export const deleteQuotePost = async (postId: string): Promise<string> => {
  try {
    const res = await ky.delete(`/api/posts/${postId}/unquote`);

    if (res.ok) {
      const data: DeletePostResponse = await res.json();
      return data.message || "Post unquoted successfully";
    } else {
      const errorData: DeletePostResponse = await res.json();
      console.error("Error unquoting post:", errorData);
      return errorData.error || "Unknown error trying to unquote the post";
    }
  } catch (error) {
    console.error("error:", error);
    return "Error al eliminar el post: " + (error instanceof Error ? error.message : "Unknown");
  }
};