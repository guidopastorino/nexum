"use client";

import React, { useEffect } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import Post from "@/components/Post";
import { PostProps } from "@/types/types";
import Loader, { StrokeLoader } from "@/components/Loader";
import AsideRight from "@/components/AsideRight";
import { useSession } from "next-auth/react";
import { fetchPosts } from "@/utils/fetchFunctions";
import SearchBox from "@/components/SearchBox";
import FeedSelector from "@/components/FeedSelector";
import PullToRefresh from "react-simple-pull-to-refresh";

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
    refetch,
  } = useInfiniteScroll<PostProps>({
    queryKey: ["posts", userId || "guest"],
    fetcher: (page, pageSize) => fetchPosts(page, pageSize),
    refetchOnWindowFocus: true,
    pageSize: 20,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  useEffect(() => console.log(posts), [posts]);

  const handleRefresh = async () => {
    if (refetch) {
      await refetch();
    }
  };

  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center p-5">
        <StrokeLoader />
      </div>
    );

  if (isError) {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-3 text-gray-600 dark:text-gray-300">
        <p>Error al cargar los posts:</p>
        <p>
          {error instanceof Error
            ? error.message
            : "No se encontraron posts disponibles."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <FeedSelector />

        <PullToRefresh
          onRefresh={handleRefresh} // handleRefresh ahora devuelve una Promise
          canFetchMore={true}
          onFetchMore={fetchNextPage}
          resistance={2}
          refreshingContent={
            <div className="w-full flex justify-center items-center p-5">
              <StrokeLoader />
            </div>
          }
          pullingContent={
            <div className="w-full flex flex-col justify-center items-center gap-3 text-gray-600 dark:text-gray-300 p-4 text-center">
              <p>&#8681; Pull down to refresh your feed &#8681;</p>
            </div>
          }
        >
          <>
            {posts.map((post, i) => (
              <Post key={post.maskedId} {...post} />
            ))}

            {isFetchingNextPage && (
              <div className="flex justify-center items-center p-3">
                <StrokeLoader />
              </div>
            )}
            {!hasNextPage && (
              <div className="flex justify-center items-center px-4 py-14 dark:text-neutral-500 text-gray-500">
                End of feed
              </div>
            )}
          </>
        </PullToRefresh>
      </div>

      <AsideRight>
        <SearchBox />
      </AsideRight>
    </>
  );
};

export default PostsList;