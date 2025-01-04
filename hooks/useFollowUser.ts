"use client"

import { useMutation, useQueryClient } from 'react-query';
import ky from 'ky';
import { useSession } from 'next-auth/react';

// Definimos las funciones para follow/unfollow
const followUser = async (userId: string): Promise<any> => {
  const response = await ky.post(`/api/users/${userId}/follow`).json(); // Aquí no es necesario pasar un cuerpo si no lo necesitas
  return response;
};

const unfollowUser = async (userId: string): Promise<any> => {
  const response = await ky.post(`/api/users/${userId}/unfollow`).json(); // Al igual que arriba
  return response;
};

// Hook optimista para seguir o dejar de seguir
export const useFollowUser = (userId: string, isFollowing: boolean, postId?: string) => {
  const queryClient = useQueryClient(); // Obtener el queryClient

  const { data: session } = useSession()

  return useMutation(
    isFollowing ? () => unfollowUser(userId) : () => followUser(userId),
    {
      // Optimistic update: se actualiza el estado inmediatamente
      onMutate: async () => {
        // Aquí puedes hacer el "optimistic update" en el estado del UI (si lo necesitas)
      },
      onSettled: () => {
        // Invalidar la query después de realizar la mutación
        queryClient.invalidateQueries(['creatorDataHoverCard', userId]);
        queryClient.invalidateQueries(['userProfile', userId]);
        if(postId){
          queryClient.invalidateQueries(['post', postId]);
        }
      },
      onError: (error) => {
        // Aquí puedes manejar cualquier error, si ocurre
        console.error('Error while following/unfollowing:', error);
      },
    }
  );
};