import { useInfiniteQuery } from 'react-query';

// Definimos el tipo de datos que vamos a recibir (por ejemplo, posts o comentarios)
interface InfiniteScrollProps<T> {
  queryKey: any;
  fetcher: (page: number, pageSize: number) => Promise<T[]>;
  pageSize?: number;
  staleTime?: number;
}

// Custom hook
function useInfiniteScroll<T>({
  queryKey,
  fetcher,
  pageSize = 10,
  staleTime = 1000 * 60 * 5,
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
      getNextPageParam: (lastPage, allPages) => {
        // Determinar si hay más datos que cargar. Se puede personalizar esto según la lógica de la API.
        return lastPage.length < pageSize ? undefined : allPages.length + 1;
      },
    }
  );

  // Flatten data into a single array
  const items = data?.pages.flat() ?? [];

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