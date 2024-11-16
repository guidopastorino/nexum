// user type
export interface UserState {
  _id: string | null;
  fullname: string | null;
  username: string | null;
  email: string | null;
  profileImage: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// interface for lean objects in mongoose (return response)
export interface IUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  profileImage: string | null;
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
export interface PostMedia {
  type: 'image' | 'video';
  filename: string;
  extension: string;
  src: string;
  // ...
}

export type WhoCanReplyPost = 'Everyone' | 'Accounts you follow' | 'Verified accounts' | 'Only accounts you mention';

// añadir props del post quoteado
// como se almacena en la db es diferente a las props o a como se devuelve en el server
// Interfaz de props para el componente Post
export interface PostProps {
  _id: string;
  creator: {
    _id: string;
    profileImage: string;
    fullname: string;
    username: string;
  };
  communityId?: string;
  feedId?: string;
  content: string;
  tags?: string[];
  likes: string[]; // Aquí se mostrarán los likes del post original cuando sea repost
  repostedFrom?: {
    _id: string,
    creator: {
      _id: string,
      fullname: string,
      username: string,
      profileImage: string
    },
    content: string,
    quotedPost?: {
      _id: string;
      creator: {
        _id: string;
        profileImage: string;
        fullname: string;
        username: string;
      };
      content: string;
      media: string[];
      createdAt: Date;
    };
    media: string[],
    createdAt: Date,
    likes: string[],
    comments: string[],
  };
  quotedPost?: {
    _id: string;
    creator: {
      _id: string;
      profileImage: string;
      fullname: string;
      username: string;
    };
    content: string;
    media: string[];
    createdAt: Date;
  };
  media?: string[];
  type: 'normal' | 'repost' | 'quote';
  comments: string[]; // Los comentarios son los del post original
  views?: number;
  createdAt: Date;
}


// ¿que campos lleva completo cada post?
/*

*/