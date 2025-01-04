"use client";

import { PostProps } from "@/types/types";
import { getUserPosts } from "@/utils/fetchFunctions";
import React from "react";
import { useQuery } from "react-query";
import Loader, { StrokeLoader } from "../Loader";
import Post from "../Post";
import useUser from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import AuthModal from "../modal/AuthModal";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

// creator is the username of the user
const PostsList = ({ creator }: { creator: string }) => {
  const { status } = useSession();
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
    queryKey: ["userPosts", creator],
    fetcher: (page, pageSize) => getUserPosts(creator, page, pageSize),
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
        {creator === user.username ? (
          <p className="text-center text-gray-500">
            You haven't posted anything yet!
          </p>
        ) : (
          <p className="text-center text-gray-500">
            @{creator} hasn't posted yet.
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

      {status === "unauthenticated" && posts.length < 5 && (
        <div className="h-[50dvh] flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <AuthModal
              buttonTrigger={
                <div className="rounded-full text-white px-4 py-2 bg-orange-600 hover:bg-orange-700 active:brightness-90 duration-200 cursor-pointer">
                  Login or register
                </div>
              }
            />
            <span>to see full @{creator}'s posts!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;