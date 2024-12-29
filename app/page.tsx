"use client"

import React from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Post from '@/components/Post';
import { PostProps } from '@/types/types';
import Loader from '@/components/Loader';
import PostSkeleton from '@/components/PostSkeleton';
import CreatePostFixedButton from '@/components/CreatePostFixedButton';
import AsideRight from '@/components/AsideRight';
import SelectFeedFixedButton from '@/components/SelectFeedFixedButton';
import { useSession } from 'next-auth/react';
import { fetchPosts } from '@/utils/fetchFunctions';

const PostsList = () => {
  const { data: session } = useSession()

  const {
    items: posts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScroll<PostProps>({
    queryKey: ['posts'],
    fetcher: (page, pageSize) => fetchPosts(page, pageSize, session?.user.id || null),
    pageSize: 35,
    enabled: !!session?.user.id
  });

  if (isLoading) return <div className='w-full flex flex-col justify-start items-start gap-3'>
    {Array.from({ length: 10 }).map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>;

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
      <div>
        {posts.map((post, i) => (
          <Post key={i} {...post} />
        ))}
        {isFetchingNextPage && <div className='flex justify-center items-center p-3'><Loader width={30} height={30} /></div>}
        {!hasNextPage && <div className='flex justify-center items-center p-3 dark:text-neutral-500 text-gray-500'>&#8226;</div>}
        <CreatePostFixedButton />
        <SelectFeedFixedButton />
      </div>

      <AsideRight>
        Who to follow
      </AsideRight>
    </>
  );
};

export default PostsList;
