"use client";

import React, { useEffect } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import Post from "@/components/Post";
import { PostProps } from "@/types/types";
import Loader from "@/components/Loader";
import PostSkeleton from "@/components/PostSkeleton";
import AsideRight from "@/components/AsideRight";
import { useSession } from "next-auth/react";
import { fetchPosts } from "@/utils/fetchFunctions";
import SearchBox from "@/components/SearchBox";
import FeedSelector from "@/components/FeedSelector";

const PostsList = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || null;

  const {
    items: posts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScroll<PostProps>({
    queryKey: ["posts", userId || "guest"],
    fetcher: (page, pageSize) => fetchPosts(page, pageSize),
    pageSize: 35,
    refetchOnWindowFocus: false
  });

  useEffect(() => console.log(posts), [posts])

  if (isLoading)
    return (
      <div className="w-full flex flex-col justify-start items-start gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );

  if (isError) {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-3 text-gray-600 dark:text-gray-300">
        <p>Error al cargar los posts:</p>
        <p>
          {error instanceof Error ? error.message : "No se encontraron posts disponibles."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <FeedSelector />

        {posts.map((post, i) => (
          <Post key={i} {...post} />
        ))}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center p-3">
            <Loader width={30} height={30} />
          </div>
        )}
        {!hasNextPage && (
          <div className="flex justify-center items-center px-4 py-14 dark:text-neutral-500 text-gray-500">
            End of feed
          </div>
        )}
      </div>

      <AsideRight>
        <SearchBox />
      </AsideRight>
    </>
  );
};

export default PostsList;