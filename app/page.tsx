"use client"

import React from 'react';
import { useQuery } from 'react-query';
import ky from 'ky';
import { PostProps } from '@/types/types';
import Post from '@/components/Post';

const fetchPosts = async (page: number, pageSize: number): Promise<PostProps[]> => {
  const response: PostProps[] = await ky.get(`/api/posts?page=${page}&pageSize=${pageSize}`).json();
  return response;
};

// Usamos el tipo definido anteriormente para los posts
const PostsList = () => {
  const { data: posts, isLoading, error } = useQuery<PostProps[], Error>(
    ['posts', 1, 10], // Página 1, tamaño 10
    () => fetchPosts(1, 10),
    { staleTime: 1000 * 60 * 5 } // Mantener los datos durante 5 minutos en caché
  );

  if (isLoading) return <p>Cargando posts...</p>;
  if (error) return <p>Error al cargar los posts.</p>;

  return (
    <div>
      {posts?.map((post, i) => (
        <Post key={i} {...post} />
      ))}
    </div>
  );
};

export default PostsList;
