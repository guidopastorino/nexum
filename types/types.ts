// user type
export interface UserState {
  _id: string | null;
  fullname: string | null;
  username: string | null;
  isVerified: boolean | null;
  email: string | null;
  profileImage: string | null;
  bannerImage: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// interface for lean objects in mongoose (return response)
export interface IUser {
  _id: string;
  fullname: string;
  username: string;
  isVerified: boolean;
  email: string;
  profileImage: string | null;
  bannerImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// notification
export type NotificationType = 'email' | 'follower' | 'account'

export type NotificationProps = {
  _id: string;
  type?: NotificationType; // defines the icon
  title: string;
  message: string;
  seen: boolean; // false by default
  createdAt: string;
  updatedAt?: string;
}

// search results (pagination)
export type UserSearchPaginationProps = {
  _id: string;
  fullname: string;
  username: string;
  profileImage: string;
}

export type PostSearchPaginationProps = {
  _id: string;
  creator: string;
  content: string;
}

export type SearchResultsResponse = {
  users: UserSearchPaginationProps[];
  posts: PostSearchPaginationProps[];
  pagination: {
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    totalResults: number;
  };
};

// --------- POST ----------
// Post Media
type ServerData = {
  uploadedBy: string;
};

export type MediaFile = {
  name: string;
  size: number; // Tamaño en bytes
  key: string; // Identificador único
  lastModified: number;
  serverData: ServerData; // Datos del servidor relacionados al archivo
  url: string; // URL para acceder al archivo
  appUrl: string; // URL específica de la aplicación
  customId: string | null; // ID personalizado (opcional)
  type: string; // Tipo MIME (por ejemplo, "image/png", "video/mp4"). Sirve para identificar qué tipo es el media
  fileHash: string;
};

export type WhoCanReplyPost = 'Everyone' | 'Accounts you follow' | 'Verified accounts' | 'Only accounts you mention';

// añadir props del post quoteado
// como se almacena en la db es diferente a las props o a como se devuelve en el server
// Interfaz de props para el componente Post
export interface PostProps {
  _id: string;
  maskedId: string;
  creator: {
    _id: string;
    profileImage: string;
    fullname: string;
    username: string;
  };
  communityId?: string;
  feedId?: string;
  content: string;
  likes: string[]; // Aquí se mostrarán los likes del post original cuando sea repost
  repostedFrom?: {
    _id: string,
    maskedId: string;
    creator: {
      _id: string,
      fullname: string,
      username: string,
      profileImage: string
    },
    content: string,
    quotedPost?: {
      _id: string;
      maskedId: string;
      creator: {
        _id: string;
        profileImage: string;
        fullname: string;
        username: string;
      };
      content: string;
      media: MediaFile[];
      createdAt: Date;
    };
    media: MediaFile[],
    likes: string[],
    comments: string[],
    createdAt: Date,
  };
  quotedPost?: {
    _id: string;
    maskedId: string;
    creator: {
      _id: string;
      profileImage: string;
      fullname: string;
      username: string;
    };
    content: string;
    media: MediaFile[];
    createdAt: Date;
  };
  media: MediaFile[];
  type: 'normal' | 'repost' | 'quote';
  comments: string[];
  createdAt: Date;
}


// ¿que campos lleva completo cada post?
/*

*/