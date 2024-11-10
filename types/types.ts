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
  creatorId: string;
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