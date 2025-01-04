"use client"

import { PostSearchPaginationProps, SearchResultsResponse, UserSearchPaginationProps } from "@/types/types";
import ky from "ky";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Loader from "./Loader";

const SearchBox = () => {
  const InputRef = useRef<HTMLInputElement | null>(null);
  const ResultsRef = useRef<HTMLDivElement | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [isloading, setIsLoading] = useState<boolean>(false);
  // results 
  const [users, setUsers] = useState<UserSearchPaginationProps[]>([]);
  const [posts, setPosts] = useState<PostSearchPaginationProps[]>([]); // Añadimos los posts también
  const [pagination, setPagination] = useState<{
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    totalResults: number; // Incluye total de posts + usuarios
  }>({ currentPage: 1, nextPage: null, prevPage: null, totalResults: 0 });

  const router = useRouter();

  // Maneja el evento de click fuera del input y el contenedor de resultados
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.target === InputRef.current || e.target === ResultsRef.current) return;
      if (showResults) {
        if (!ResultsRef.current?.contains(e.target as Node)) {
          setShowResults(false);
        }
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showResults]);

  // Maneja el evento de búsqueda con paginación
  const getResultsPagination = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const queryValue = e.target.value;

    setQuery(queryValue);

    if (queryValue.trim() === '') {
      setUsers([]);
      setPosts([]);
      setPagination({ currentPage: 1, nextPage: null, prevPage: null, totalResults: 0 });
      setShowResults(false);
      return;
    }

    try {
      setIsLoading(true)
      const response = await ky.get(`/api/search?query=${encodeURIComponent(queryValue)}&page=${pagination.currentPage}`).json<SearchResultsResponse>();

      // Actualizar los resultados de usuarios, posts y la paginación
      setUsers(response.users);
      setPosts(response.posts); // Añadimos los posts a los resultados
      setPagination({
        currentPage: response.pagination.currentPage,
        nextPage: response.pagination.nextPage,
        prevPage: response.pagination.prevPage,
        totalResults: response.pagination.totalResults, // Incluimos los resultados totales de usuarios + posts
      });
      setShowResults(true); // Aseguramos que se muestren los resultados al hacer una búsqueda
      setIsLoading(false)
    } catch (error) {
      console.error(error);
      setIsLoading(false)
    }
  };

  // Maneja el evento de la tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      // Redirigir a la página de búsqueda con el query actual y la página 1
      router.push(`/search?query=${encodeURIComponent(query)}&page=1`);
      // Ocultar caja de resultados
      setShowResults(false)
    }
  };

  // Calcular los resultados restantes de usuarios y posts
  const remainingResultsUsers = pagination.totalResults - users.length;
  const remainingResultsPosts = pagination.totalResults - posts.length;
  const remainingResults = remainingResultsUsers + remainingResultsPosts;

  return (
    <div className="relative">
      <input
        ref={InputRef}
        type="search"
        placeholder="Start typing to search anything..."
        className="w-full p-2 rounded-md h-9 text-ellipsis"
        onFocus={() => setShowResults(true)}
        onChange={getResultsPagination}
        onKeyDown={handleKeyDown}
        value={query} // Asegura que el estado de la búsqueda se mantenga sincronizado con el input
      />
      {showResults && query.length > 0 && (
        <div ref={ResultsRef} className="absolute top-full mt-3 left-0 w-full min-h-52 max-h-[calc(100dvh-100px)] pb-3 bg-white dark:bg-neutral-800 md:rounded-md z-50 shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center gap-3 mb-3 sticky top-0 bg-white dark:bg-neutral-800 z-40 py-2 px-3">
            <span className="block font-medium text-xl">Search results for "{query}"</span>
            <button onClick={() => setShowResults(false)} className='itemHover w-10 h-10 rounded-full flex justify-center items-center text-lg'>
              <RxCross2 />
            </button>
          </div>

          {isloading && <div className='w-full p-3 flex justify-center items-center'><Loader width={30} height={30} /></div>}

          {!isloading && pagination.totalResults == 0 && <div className='text-center p-4 opacity-60'>No results to show</div>}

          {/* Lista de usuarios */}
          {!isloading && <>
            <div className="w-full">
              {users.map((user) => (
                <Link onClick={() => setShowResults(false)} href={`/${user.username}`} key={user._id} className="flex w-full items-center gap-3 p-3 itemHover">
                  <img src={user.profileImage} alt={user.username} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium">{user.fullname}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mostrar el enlace para ver más resultados */}
            {remainingResults > 0 && (
              <div className="mt-3 text-center">
                <Link onClick={() => setShowResults(false)} href={`/search?query=${query}&page=${pagination.currentPage}`} className="text-blue-500 hover:underline">
                  Ver {remainingResults} {remainingResults > 1 ? "resultados" : "resultado"} más...
                </Link>
              </div>
            )}
          </>}
        </div>
      )}
    </div>
  );
};

export default SearchBox