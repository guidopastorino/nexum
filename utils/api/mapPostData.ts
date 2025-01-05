import { Types } from "mongoose";
import Post from "@/models/Post";
import User from "@/models/User";

export const mapPostData = async (posts: any[], userId: string | null = null) => {
  return Promise.all(
    posts.map(async (post) => {
      const postId = post._id.toString();
      const creatorId = post.creator._id.toString();

      // base case (normal post)
      const isFollowing = userId ? Boolean(await User.exists({ _id: userId, following: creatorId })) : false;
      const isPinned = Boolean(await User.exists({ _id: creatorId, pinnedPosts: postId })) || false;
      const isHighlighted = userId ? Boolean(await User.exists({ _id: userId, highlightedPosts: postId })) : false;
      const isOnList = userId ? Boolean(await User.exists({ _id: userId, mutedUsers: creatorId })) : false;
      const isUserMuted = userId ? Boolean(await User.exists({ _id: userId, mutedUsers: creatorId })) : false;
      const isBlocked = userId ? Boolean(await User.exists({ _id: userId, blockedUsers: creatorId })) : false;
      const isConversationMuted = userId ? Boolean(await User.exists({ _id: userId, mutedConversations: postId })) : false;

      // for isLiked, isBookmarked, isReposted and isQuoted states
      const checkUserInteraction = (list: Types.ObjectId[] | undefined) =>
        userId && Array.isArray(list) && list.some((id: Types.ObjectId) => id.toString() === userId);

      const repostedFrom = post.repostedFrom ? {
        _id: post.repostedFrom._id.toString(),
        maskedId: post.repostedFrom.maskedId,
        creator: {
          _id: post.repostedFrom.creator._id.toString(),
          fullname: post.repostedFrom.creator.fullname,
          username: post.repostedFrom.creator.username,
          profileImage: post.repostedFrom.creator.profileImage,
        },
        content: post.repostedFrom.content,
        media: post.repostedFrom.media,
        likesCount: post.repostedFrom.likes?.length || 0,
        commentsCount: post.repostedFrom.comments?.length || 0,
        bookmarksCount: post.repostedFrom.bookmarks?.length || 0,
        quotesCount: post.repostedFrom.quotes?.length || 0,
        repostsCount: post.repostedFrom.reposts?.length || 0,
        isLiked: checkUserInteraction(post.repostedFrom.likes),
        isBookmarked: checkUserInteraction(post.repostedFrom.bookmarks),
        isReposted: checkUserInteraction(post.repostedFrom.reposts),
        isQuoted: checkUserInteraction(post.repostedFrom.quotes),
        isPinned: Boolean(await User.exists({ _id: post.repostedFrom.creator._id, pinnedPosts: post.repostedFrom._id })),
        isHighlighted: userId ? Boolean(await User.exists({ _id: userId, highlightedPosts: post.repostedFrom._id })) : false,
        isConversationMuted: userId ? Boolean(await User.exists({ _id: userId, mutedConversations: post.repostedFrom._id })) : false,
        isBlocked: userId ? Boolean(await User.exists({ _id: userId, blockedUsers: post.repostedFrom.creator._id })) : false,
        isFollowing: userId ? Boolean(await User.exists({ _id: userId, following: post.repostedFrom.creator._id })) : false,
        isOnList: userId ? Boolean(await User.exists({ _id: userId, mutedUsers: post.repostedFrom.creator._id })) : false,
        isUserMuted: userId ? Boolean(await User.exists({ _id: userId, mutedUsers: post.repostedFrom.creator._id })) : false,
        createdAt: post.repostedFrom.createdAt,
        quotedPost: post.repostedFrom.quotedPost ? {
          _id: post.repostedFrom.quotedPost._id.toString(),
          maskedId: post.repostedFrom.quotedPost.maskedId,
          creator: {
            _id: post.repostedFrom.quotedPost.creator._id.toString(),
            fullname: post.repostedFrom.quotedPost.creator.fullname,
            username: post.repostedFrom.quotedPost.creator.username,
            profileImage: post.repostedFrom.quotedPost.creator.profileImage,
          },
          content: post.repostedFrom.quotedPost.content,
          media: post.repostedFrom.quotedPost.media,
          createdAt: post.repostedFrom.quotedPost.createdAt,
        } : undefined,
      } : undefined;

      const quotedPost = post.quotedPost ? {
        _id: post.quotedPost._id.toString(),
        maskedId: post.quotedPost.maskedId,
        creator: {
          _id: post.quotedPost.creator._id.toString(),
          fullname: post.quotedPost.creator.fullname,
          username: post.quotedPost.creator.username,
          profileImage: post.quotedPost.creator.profileImage,
        },
        content: post.quotedPost.content,
        media: post.quotedPost.media,
        createdAt: post.quotedPost.createdAt,
      } : undefined;

      return {
        _id: post._id.toString(),
        maskedId: post.maskedId,
        creator: {
          _id: post.creator._id.toString(),
          fullname: post.creator.fullname,
          username: post.creator.username,
          profileImage: post.creator.profileImage,
        },
        communityId: post.communityId,
        feedId: post.feedId,
        content: post.content,
        media: post.media,
        type: post.type,
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
        bookmarksCount: post.bookmarks?.length || 0,
        quotesCount: post.quotes?.length || 0,
        repostsCount: Array.isArray(post.reposts) ? post.reposts.length : 0,
        isLiked: checkUserInteraction(post.likes),
        isBookmarked: checkUserInteraction(post.bookmarks),
        isReposted: checkUserInteraction(post.reposts),
        isQuoted: checkUserInteraction(post.quotes),
        isFollowing,
        isPinned,
        isHighlighted,
        isOnList,
        isUserMuted,
        isBlocked,
        isConversationMuted,
        createdAt: post.createdAt,
        repostedFrom,
        quotedPost,
      };
    })
  );
};