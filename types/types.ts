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
    // post numbers
    likesCount: number;
    commentsCount: number;
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
    createdAt: Date;
  };
  media: MediaFile[];
  type: 'normal' | 'repost' | 'quote';
  // post numbers
  likesCount: number;
  commentsCount: number;
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