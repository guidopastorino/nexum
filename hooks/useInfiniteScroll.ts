"use client"

import { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';

interface InfiniteScrollProps<T> {
  queryKey: any;
  fetcher: (page: number, pageSize: number) => Promise<T[]>;
  pageSize?: number;
  staleTime?: number;
  scrollOffset?: number; // Distancia al final de la página para cargar más
  enabled?: boolean;
}

function useInfiniteScroll<T>({
  queryKey,
  fetcher,
  pageSize = 10,
  staleTime = 1000 * 60 * 5,
  scrollOffset = 300, // Default: cargar más 300px antes del final de la página
  enabled = true
}: InfiniteScrollProps<T>) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    queryKey,
    ({ pageParam = 1 }) => fetcher(pageParam, pageSize),
    {
      staleTime,
      // refetchOnWindowFocus: true,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < pageSize ? undefined : allPages.length + 1;
      },
      enabled
    }
  );

  // Flatten data into a single array
  const items = data?.pages.flat() ?? [];

  // Lógica de scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      if (
        scrollHeight - scrollTop - clientHeight <= scrollOffset &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, scrollOffset]);

  return {
    items,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}

export default useInfiniteScroll;