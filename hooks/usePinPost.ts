import ky from 'ky';
import { useMutation, useQueryClient } from 'react-query';

interface UsePinPostReturn {
  mutate: () => void;
}

export const usePinPost = (creatorUsername:string, postId: string, initialIsPinned: boolean): UsePinPostReturn => {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async () => {
      if (initialIsPinned) {
        // Unpin request
        await ky.delete(`/api/posts/${postId}/unpin`);
      } else {
        // Pin request
        await ky.post(`/api/posts/${postId}/pin`);
      }
    },
    {
      onMutate: async () => {
        // Optimistic update logic could go here if needed
        queryClient.invalidateQueries(["userPosts", creatorUsername])

      },
      onError: (error) => {
        console.error('Error pinning/unpinning post:', error);
      },
      onSuccess: () => {
        console.log(`Post ${postId} pin state toggled successfully.`);
      },
    }
  );

  return {
    mutate: () => mutation.mutate(),
  };
};