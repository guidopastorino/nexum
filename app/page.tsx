"use client"

import React, { useEffect } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Post from '@/components/Post';
import { PostProps } from '@/types/types';
import ky from 'ky';
import Loader from '@/components/Loader';

const fetchPosts = async (page: number, pageSize: number): Promise<PostProps[]> => {
  return await ky.get(`/api/posts?page=${page}&pageSize=${pageSize}`).json();
};

const PostsList = () => {
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
    fetcher: fetchPosts,
    pageSize: 5
  });

  // Función de scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <div className='flex justify-center items-center p-3'><Loader width={30} height={30} /></div>;
  if (isError) return <p>Error al cargar los posts: {error instanceof Error ? error.message : "Error al cargar los posts"}</p>;

  return (
    <div>
      {posts.map((post, i) => (
        <Post key={i} {...post} />
      ))}
      {isFetchingNextPage && <div className='flex justify-center items-center p-3'><Loader width={30} height={30} /></div>}
      {!hasNextPage && <div className='flex justify-center items-center p-3 dark:text-neutral-500 text-gray-500'>&#8226;</div>}
    </div>
  );
};

export default PostsList;
