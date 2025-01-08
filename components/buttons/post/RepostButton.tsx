import React, { useEffect, useState } from 'react';
import { HiOutlineArrowPathRoundedSquare } from 'react-icons/hi2';
import ky from 'ky';
import useToast from '@/hooks/useToast';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import AuthModal from '@/components/modal/AuthModal';

type RepostButtonProps = {
  initialRepostState: boolean;
  initialRepostsLength: number;
  postId: string;
  onRepostUpdate: (newRepostsCount: number, newRepostState: boolean) => void;
  setMenuOpen: (open: boolean) => void;
};

const RepostButton = ({
  initialRepostState,
  initialRepostsLength,
  postId,
  onRepostUpdate,
  setMenuOpen,
}: RepostButtonProps) => {
  const [reposted, setReposted] = useState(initialRepostState);
  const [repostsCount, setRepostsCount] = useState(initialRepostsLength);
  const { data: session } = useSession();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setReposted(initialRepostState); // Sincroniza el estado inicial
  }, [initialRepostState]);

  const handleRepost = async () => {
    if (!session) {
      return;
    }

    try {
      setRepostsCount((prev) => prev + 1);
      setReposted(true);
      onRepostUpdate(repostsCount + 1, true);
      await ky.post(`/api/posts/`, { json: { repostedFrom: postId, type: 'repost' } });
      queryClient.invalidateQueries(['creatorDataHoverCard', session?.user?.id]);
      queryClient.invalidateQueries(['userProfile', session?.user?.id]);
      queryClient.invalidateQueries(['userPosts', session?.user?.id]);
      showToast("Reposted");
    } catch (error) {
      console.error(error);
      setRepostsCount((prev) => prev - 1);
      setReposted(false);
      onRepostUpdate(Math.max(repostsCount - 1, 0), false);
      showToast("Failed to repost");
    }

    setMenuOpen(false)
  };

  const handleUndoRepost = async () => {
    if (!session) {
      return;
    }

    try {
      setRepostsCount((prev) => prev - 1);
      setReposted(false);
      onRepostUpdate(Math.max(repostsCount - 1, 0), false);
      await ky.delete(`/api/posts/${postId}/undo-repost`);
      queryClient.invalidateQueries(['creatorDataHoverCard', session?.user?.id]);
      queryClient.invalidateQueries(['userProfile', session?.user?.id]);
      queryClient.invalidateQueries(['userPosts', session?.user?.id]);
      showToast("Repost removed");
    } catch (error) {
      console.error(error);
      setRepostsCount((prev) => prev + 1);
      setReposted(true);
      onRepostUpdate(repostsCount + 1, true);
      showToast("Failed to undo repost");
    }

    setMenuOpen(false)
  };

  // if (!session) {
  //   return <AuthModal
  //     buttonTrigger={<div
  //       className='itemClass itemHover'
  //     >
  //       <HiOutlineArrowPathRoundedSquare size={20} />
  //       <span>Repost</span>
  //     </div>}
  //   />
  // }

  return (
    <div
      onClick={reposted ? handleUndoRepost : handleRepost}
      className={`${reposted ? 'font-bold text-green-600' : ''} itemClass itemHover`}
    >
      <HiOutlineArrowPathRoundedSquare size={20} />
      <span>{reposted ? "Undo repost" : "Repost"}</span>
    </div>
  );
};

export default RepostButton;