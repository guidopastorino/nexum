import React, { useState } from 'react';
import { HiOutlineArrowPathRoundedSquare } from 'react-icons/hi2';
import ky from 'ky';
import useToast from '@/hooks/useToast';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';

type RepostButtonProps = {
  initialRepostState: boolean;
  setInitialRepostState: React.Dispatch<React.SetStateAction<boolean>>;
  repostsCount: number;
  postId: string;
  setMenuOpen: (open: boolean) => void;
};

const RepostButton: React.FC<RepostButtonProps> = ({
  initialRepostState,
  setInitialRepostState,
  repostsCount,
  postId,
  setMenuOpen
}) => {
  const { data: session } = useSession()
  const [optimisticRepostsCount, setOptimisticRepostsCount] = useState(repostsCount);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const queryClient = useQueryClient();

  // Función para manejar el clic en el botón de repost
  const handleRepostClick = async () => {
    setMenuOpen(false);
  
    // Actualizar estado optimista
    const newRepostState = !initialRepostState; // El nuevo estado que queremos
    setInitialRepostState(newRepostState);
    setOptimisticRepostsCount(
      optimisticRepostsCount + (newRepostState ? 1 : -1)
    );
  
    setIsLoading(true);
  
    try {
      if (newRepostState) {
        // Hacer POST para "Repost"
        const response = await ky.post('/api/posts/', {
          json: { repostedFrom: postId, type: "repost" },
        });
        if (!response.ok) throw new Error("Failed to repost");
  
        showToast("Reposted");
      } else {
        // Hacer DELETE para "Undo Repost"
        const response = await ky.delete(`/api/posts/${postId}`);
        if (!response.ok) throw new Error("Failed to undo repost");
  
        showToast("Repost removed");
      }
  
      // Invalidar queries relacionadas
      // queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['creatorDataHoverCard', session?.user?.id]);
      queryClient.invalidateQueries(['userProfile', session?.user?.id]);
      queryClient.invalidateQueries(['userPosts', session?.user?.id], {
        refetchActive: true,
        refetchInactive: true,
      });
    } catch (error) {
      // Revertir estado optimista en caso de error
      setInitialRepostState(!newRepostState);
      setOptimisticRepostsCount(
        optimisticRepostsCount - (newRepostState ? 1 : -1)
      );
      console.error("Error handling repost:", error);
      showToast(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div onClick={handleRepostClick} className={`itemClass itemHover ${isLoading ? 'cursor-wait' : ''}`}>
      <HiOutlineArrowPathRoundedSquare size={20} />
      <span>{initialRepostState ? 'Undo Repost' : 'Repost'}</span>
    </div>
  );
};

export default RepostButton;