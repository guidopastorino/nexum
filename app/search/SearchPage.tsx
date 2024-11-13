'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ky from 'ky';
import Loader from '@/components/Loader';
import { PostProps } from '@/types/types';
import Post from '@/components/Post';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const page = searchParams.get('page') || '1';    // Default to 1 if not provided
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (query) {
      const getData = async () => {
        try {
          const response = await ky.get(`/api/search?query=${encodeURIComponent(query)}&page=${page}`).json();
          setResults(response);
          console.log(response);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      getData();
    }
  }, [query, page]);  // Ejecutamos el efecto cada vez que query o page cambien

  if (!query) {
    return <div>No query parameter provided.</div>;  // Si no hay query, mostramos un mensaje
  }

  if (!results) {
    return <div className='w-full p-3 flex justify-center items-center'><Loader width={40} height={40} /></div>;  // Mostramos un mensaje mientras cargan los resultados
  }

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <div>
        {results.users && results.users.length > 0 && (
          <div>
            <h2>Users</h2>
            <ul>
              {results.users.map((user: any) => (
                <li key={user._id}>
                  <p>{user.fullname} (@{user.username})</p>
                  <img src={user.profileImage} alt={user.username} width={50} height={50} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.posts && results.posts.length > 0 && (
          <div>
            {results.posts.map((post: PostProps, i: number) => (
              <Post key={i} {...post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;