import React, { useEffect, useState } from 'react';
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import ky from 'ky';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';

type LikeButtonProps = {
  username: string;
  initialLikeState: boolean;
  initialLikesLength: number;
  postId: string;
  onLikeUpdate: (newLikesCount: number, newLikeState: boolean) => void;
};

const LikeButton = ({
  username,
  initialLikeState,
  initialLikesLength,
  postId,
  onLikeUpdate,
}: LikeButtonProps) => {
  const queryClient = useQueryClient()

  const [liked, setLiked] = useState(initialLikeState);
  const [likesCount, setLikesCount] = useState(initialLikesLength);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setLiked(initialLikeState);
    setLikesCount(initialLikesLength);
  }, [initialLikeState, initialLikesLength]);

  const { data: session } = useSession();

  const handleLikeToggle = async () => {
    if (!session || isProcessing) {
      alert('You must be logged in to like posts');
      return;
    }
    
    const newLikeState = !liked;
    const updatedCount = likesCount + (newLikeState ? 1 : -1);
    
    // Actualización optimista
    setLiked(newLikeState);
    setLikesCount(updatedCount);
    onLikeUpdate(updatedCount, newLikeState);
    
    setIsProcessing(true);  // Evita clics múltiples
    try {
      const endpoint = newLikeState ? `/api/posts/${postId}/like` : `/api/posts/${postId}/unlike`;
      await ky.post(endpoint).json();
      queryClient.invalidateQueries(["userLikes", username])
    } catch (error) {
      console.error('Error toggling like:', error);
      setLiked(liked);
      setLikesCount(likesCount);
      onLikeUpdate(likesCount, liked);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className="itemHover rounded-full px-2 py-1 flex justify-center items-center gap-2"
      disabled={isProcessing}
    >
      {liked ? <HiHeart color="red" className="scale-125" /> : <HiOutlineHeart />}
      <span className={`text-sm ${liked ? 'text-red-600 font-bold' : ''}`}>{likesCount}</span>
    </button>
  );
};

export default LikeButton;