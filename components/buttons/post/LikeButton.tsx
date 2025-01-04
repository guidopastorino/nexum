import React, { useEffect, useState } from 'react';
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import ky from 'ky';
import { useSession } from 'next-auth/react';

type LikeButtonProps = {
  initialLikeState: boolean;
  initialLikesLength: number;
  postId: string;
  onLikeUpdate: (newLikesCount: number, newLikeState: boolean) => void;
};

const LikeButton = ({
  initialLikeState,
  initialLikesLength,
  postId,
  onLikeUpdate,
}: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLikeState);
  const [likesCount, setLikesCount] = useState(initialLikesLength);

  useEffect(() => {
    setLiked(initialLikeState);  // Solo sincroniza cuando cambia initialLikeState
  }, [initialLikeState]);

  const { data: session } = useSession();

  const handleLike = async () => {
    if (!session) {
      alert('You must be logged in to like posts');
      return;
    }

    try {
      setLikesCount((prev) => prev + 1);
      setLiked(true);
      onLikeUpdate(likesCount + 1, true);
      await ky.post(`/api/posts/${postId}/like`).json();
    } catch (error) {
      console.error(error);
      setLikesCount((prev) => prev - 1);
      setLiked(false);
      onLikeUpdate(Math.max(likesCount - 1, 0), false);
    }
  };

  const handleUnlike = async () => {
    if (!session) {
      alert('You must be logged in to unlike posts');
      return;
    }

    try {
      setLikesCount((prev) => prev - 1);
      setLiked(false);
      onLikeUpdate(Math.max(likesCount - 1, 0), false);
      await ky.post(`/api/posts/${postId}/unlike`).json();
    } catch (error) {
      console.error(error);
      setLikesCount((prev) => prev + 1);
      setLiked(true);
      onLikeUpdate(likesCount + 1, true);
    }
  };

  return (
    <button
      onClick={liked ? handleUnlike : handleLike}
      className={"itemHover rounded-full px-2 py-1 flex justify-center items-center gap-2"}
    >
      {liked ? <HiHeart color="red" className="scale-125" /> : <HiOutlineHeart />}
      <span className={`text-sm ${liked ? 'text-red-600 font-bold' : ''}`}>{likesCount}</span>
    </button>
  );
};

export default LikeButton;