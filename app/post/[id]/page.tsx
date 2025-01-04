"use client";

import React from "react";
import { useQuery } from "react-query";
import Post from "@/components/Post";
import { getPostData } from "@/utils/fetchFunctions";
import { PostPageProps, PostProps } from "@/types/types";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import UserDetailsProfileCard from "@/components/UserDetailsProfileCard";
import UserProfileButtons from "@/components/buttons/UserProfileButtons";
import HashWords from "@/components/HashWords";
import MediaGallery from "@/components/PostMediaGallery";

const Page = ({ params }: { params: { id: string } }) => {
  const { id: postId } = params;

  // Usamos react-query para obtener los datos del post
  const { data: post, isError, error, isLoading } = useQuery(
    ["post", postId],
    () => getPostData(postId),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error instanceof Error ? error.message : "Something went wrong"}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="w-full">
      <PageHeader>
        <span className="text-xl">Post</span>
      </PageHeader>

      <RenderPost {...post} />
    </div>
  );
};

export default Page;

const RenderPost = ({
  _id,
  maskedId,
  creator,
  communityId,
  feedId,
  content,
  repostedFrom,
  quotedPost,
  media,
  type,
  createdAt,
  isLiked,
  likesCount,
  commentsCount,
  bookmarksCount,
  quotesCount,
  repostsCount,
  isBookmarked,
  isReposted,
  isQuoted,
  isBlocked,
  isConversationMuted,
  isHighlighted,
  isOnList,
  isPinned,
  isUserMuted,
  // user-relation states
  isFollowingUser,
  isFollowedByUser,
}: PostPageProps) => {
  return (
    <div className="w-full">
      {/*  */}
      <div className="w-full flex justify-between items-center gap-3 p-3">
        <div className="flex justify-center items-center gap-2">
          <div className="shrink-0 self-start">
            <UserDetailsProfileCard creatorId={creator._id}>
              <Link href={`/${creator.username}`}>
                <img
                  className='w-12 h-12 object-cover overflow-hidden rounded-full shrink-0'
                  src={creator.profileImage}
                  alt={`${creator.fullname}'s profile image`}
                />
              </Link>
            </UserDetailsProfileCard>
          </div>
          <div className="flex flex-col items-start justify-center">
            <span>{creator.fullname}</span>
            <span className="text-sm text-gray-400 dark:text-neutral-500">@{creator.username}</span>
          </div>
        </div>
        <div className="flex justify center items-center gap-2">
          {/* follow button */}
          <UserProfileButtons
            disableIfSameUser={true}
            isFromItem={true}
            userId={creator._id}
            username={creator.username}
            isFollowingUser={isFollowingUser}
            isFollowedByUser={isFollowedByUser}
            postId={_id}
          />

          {/* options button */}
        </div>
      </div>
      {/* content and media */}
      <div className="px-3 pb-3">
        {content && <HashWords text={content} maskedId={maskedId} />}
        <MediaGallery media={media ?? []} />
      </div>
      <div className="border-y borderColor flex justify-start items-center gap-3 p-3 flex-wrap">
        {formatDate(new Date(createdAt))}
      </div>
    </div>
  )
}

const formatDate = (date: Date): string => {
  return date.toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
};