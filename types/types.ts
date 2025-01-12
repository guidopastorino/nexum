// user type
export interface UserState {
  _id: string | null;
  fullname: string | null;
  username: string | null;
  description: string | null;
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
export type MediaFile = {
  name: string; // Nombre del archivo
  // size: number; // Tamaño en bytes
  key: string; // Identificador único (fileKey para eliminar archivos)
  url: string; // URL para acceder al archivo
  type: string; // Tipo MIME (por ejemplo, "image/png", "video/mp4"). Sirve para identificar qué tipo es el archivo
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
      // for reply posts
      parentPost?: PostProps | null;
      replyingTo?: { // User
        _id: string;
        username: string;
      };
      createdAt: Date;
    };
    media: MediaFile[],
    // for reply posts
    parentPost?: PostProps | null;
    replyingTo?: { // User
      _id: string;
      username: string;
    };
    // post numbers
    likesCount: number;
    repliesCount: number;
    bookmarksCount: number;
    quotesCount: number;
    repostsCount: number;
    // aditional states:
    // user-post relation
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted: boolean;
    isQuoted: boolean;
    isPinned: boolean;
    isHighlighted: boolean;
    isConversationMuted: boolean;
    // user-user relation
    isBlocked: boolean;
    isFollowing: boolean;
    isOnList: boolean;
    isUserMuted: boolean;
    // Dates
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
    // for reply posts
    parentPost: string; // id 
    replyingTo: string; // username
    createdAt: Date;
  };
  media: MediaFile[];
  // for reply posts
  parentPost?: PostProps | null;
  replyingTo?: { // User
    _id: string;
    username: string;
  }; // user id
  type: 'normal' | 'repost' | 'quote';
  // post numbers
  likesCount: number;
  repliesCount: number;
  bookmarksCount: number;
  quotesCount: number;
  repostsCount: number;
  // aditional states:
  // user-post relation
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  isQuoted: boolean;
  isPinned: boolean;
  isHighlighted: boolean;
  isConversationMuted: boolean;
  // user-user relation
  isBlocked: boolean;
  isFollowing: boolean;
  isOnList: boolean;
  isUserMuted: boolean;
  // dates
  createdAt: Date;
}

// For the post's page
export interface PostPageProps extends PostProps {
  isFollowingUser: boolean;
  isFollowedByUser: boolean;
}

// Para cada tipo de post se usan estos tipos que definen los props necesarios para crearlos
export interface NormalPostCreationProps {
  content: string,
  media: File[], // las imágenes serán subidas desde el servidor
  type: 'normal';
}

export interface QuotePostCreationProps {
  content: string,
  media: File[], // las imágenes serán subidas desde el servidor
  quotedPost: string;
  type: 'quote';
}

export interface ReplyPostCreationProps {
  parentPost: string;
  content: string,
  media: File[], // las imágenes serán subidas desde el servidor
  quotedPost: string;
  type: 'reply';
}

// followers and following list item list response
export interface FollowData {
  _id: string; // ID único del usuario
  profileImage?: string; // URL de la imagen de perfil (opcional)
  fullname: string; // Nombre completo del usuario
  username: string; // Nombre de usuario
  isVerified: boolean; // Indica si el usuario está verificado
  description?: string; // Descripción opcional del usuario
  isFollowingUser: boolean; // Si este usuario sigue al usuario logueado
  isFollowedByUser: boolean; // Si el usuario logueado sigue a este usuario
}

// Feeds
// Response when displaying the feed item
export type FeedItemProps = {
  creatorId: string;
  creatorUsername: string;
  creatorProfileImage: string;
  feedId: string; // id to make request with the feed
  feedMaskedId: string; // id to make request with the feed
  feedTitle: string;
  feedImage: string;
  feedDescription: string;
  likedByCount: number;
  isFeedCreator?: boolean; // for user feeds
  isFeedLiked?: boolean; // for recommended feeds
}

// aside left navlinks and hamburger menu navlinks type
export type NavigationLinkProps = {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  title: string;
  route: string;
};

// respuesta al obtener datos de un usuario
// generalmente se usa para la pagina de perfil de un usuario o el hover card de un usuario
export interface UserProfile {
  _id: string;
  fullname: string;
  username: string;
  isVerified: boolean;
  profileImage: string;
  bannerImage: string;
  description: string | null;
  postsCount: number;
  repliesCount: number;
  mediaCount: number;
  feedsCount: number;
  communitiesCount: number;
  followersCount: number;
  followingCount: number;
  isFollowingUser?: boolean;
  isFollowedByUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Data to be send to update the user's basic data
export type UpdateUserData = {
  fullname?: string | null;
  username?: string | null;
  description?: string | null;
  profileImage?: string | null;
  bannerImage?: string | null;
};