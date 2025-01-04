"use client";

import { PostProps } from "@/types/types";
import { getUserLikes } from "@/utils/fetchFunctions";
import React from "react";
import { StrokeLoader } from "@/components/Loader";
import Post from "@/components/Post";
import useUser from "@/hooks/useUser";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

// creator is the username of the user
const LikedPostsList = ({ params }: { params: { username: string } }) => {
  const { username } = params

  const user = useUser();

  const {
    items: posts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScroll<PostProps>({
    queryKey: ["userLikes", username],
    fetcher: (page, pageSize) => getUserLikes(username, page, pageSize),
    pageSize: 10,
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-5">
        <StrokeLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center p-5 text-red-600">
        <p>Error loading posts: {error instanceof Error ? error.message : "Unknown error"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!posts.length && !isFetchingNextPage) {
    return (
      <div className="w-full flex flex-col justify-center items-center p-5 opacity-70">
        {username === user.username ? (
          <p className="text-center text-gray-500">
            You haven't liked anything yet!
          </p>
        ) : (
          <p className="text-center text-gray-500">
            @{username} has no likes.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {posts.map((post: PostProps) => (
        <Post key={post._id} {...post} />
      ))}
      {isFetchingNextPage && (
        <div className="w-full flex justify-center items-center p-5">
          <StrokeLoader />
        </div>
      )}
      {!hasNextPage && (
        <div className="flex justify-center items-center px-4 py-14 dark:text-neutral-500 text-gray-500">
          End of feed
        </div>
      )}

      <div className="h-[50dvh] flex justify-center items-center"></div>
    </div>
  );
};

export default LikedPostsList;