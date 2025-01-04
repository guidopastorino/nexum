import { Types } from "mongoose";
import Post from "@/models/Post";
import User from "@/models/User";

export const mapPostData = async (posts: any[], userId: string | null = null) => {
  // Usamos Promise.all para manejar las promesas dentro de un array
  return Promise.all(
    posts.map(async (post) => {
      const postId = post._id.toString();
      const creatorId = post.creator._id.toString();

      // Si `userId` es null, no realizamos las verificaciones asincrónicas
      const isFollowing = userId ? Boolean(await User.exists({ _id: userId, following: creatorId })) : false;
      const isPinned = Boolean(await User.exists({ _id: creatorId, pinnedPosts: postId })) || false;
      const isHighlighted = userId ? Boolean(await User.exists({ _id: userId, highlightedPosts: postId })) : false;
      const isOnList = userId ? Boolean(await User.exists({ _id: userId, mutedUsers: creatorId })) : false;
      const isUserMuted = userId ? Boolean(await User.exists({ _id: userId, mutedUsers: creatorId })) : false;
      const isBlocked = userId ? Boolean(await User.exists({ _id: userId, blockedUsers: creatorId })) : false;
      const isConversationMuted = userId ? Boolean(await User.exists({ _id: userId, mutedConversations: postId })) : false;
      const isLiked = userId
        ? Array.isArray(post.likes) && post.likes.some((like: Types.ObjectId) => like.toString() === userId)
        : false;
      const isBookmarked = userId
        ? Array.isArray(post.bookmarks) && post.bookmarks.some((bookmark: Types.ObjectId) => bookmark.toString() === userId)
        : false;
      const isReposted = userId
        ? Array.isArray(post.reposts) && post.reposts.some((repost: Types.ObjectId) => repost.toString() === userId)
        : false;
      const isQuoted = userId
        ? Array.isArray(post.quotes) && post.quotes.some((quote: Types.ObjectId) => quote.toString() === userId)
        : false;

      return {
        ...post.toObject(),
        likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
        commentsCount: Array.isArray(post.comments) ? post.comments.length : 0,
        bookmarksCount: Array.isArray(post.bookmarks) ? post.bookmarks.length : 0,
        quotesCount: Array.isArray(post.quotes) ? post.quotes.length : 0,
        repostsCount: Array.isArray(post.reposts) ? post.reposts.length : 0,
        isLiked,
        isBookmarked,
        isReposted,
        isQuoted,
        isFollowing,
        isPinned,
        isHighlighted,
        isOnList,
        isUserMuted,
        isBlocked,
        isConversationMuted,
      };
    })
  );
};