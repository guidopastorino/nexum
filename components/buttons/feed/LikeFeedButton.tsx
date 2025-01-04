import Loader from '@/components/Loader';
import ky from 'ky';
import React, { useState } from 'react';
import { BsDashLg, BsPlus } from 'react-icons/bs';
import { useQueryClient } from 'react-query';

type LikeFeedButtonProps = {
  feedMaskedId: string;
  feedTitle: string;
  initialIsFeedLikedState: boolean; // Cambié a boolean ya que el estado es true/false
  setInitialIsFeedLikedState: React.Dispatch<React.SetStateAction<boolean>>;
};

const LikeFeedButton: React.FC<LikeFeedButtonProps> = ({
  feedMaskedId,
  feedTitle,
  initialIsFeedLikedState,
  setInitialIsFeedLikedState,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient()

  const handleLikeFeed = async () => {
    setIsLoading(true);
    try {
      const endpoint = initialIsFeedLikedState
        ? `/api/feeds/${feedMaskedId}/unlike`
        : `/api/feeds/${feedMaskedId}/like`;

      const res = await ky.post(endpoint).json();
      console.log(res);

      queryClient.invalidateQueries(['userFeeds'])
      queryClient.invalidateQueries(['recommendedFeeds'])

      setInitialIsFeedLikedState(!initialIsFeedLikedState);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeFeed}
      disabled={isLoading}
      className={`w-10 h-10 flex justify-center items-center itemHover ${isLoading ? 'cursor-not-allowed opacity-90' : ''}`}
    >
      {isLoading ? (
        <Loader width={24} height={24} borderWidth={3} />
      ) : initialIsFeedLikedState ? (
        <BsDashLg size={20} />
      ) : (
        <BsPlus size={20} />
      )}
    </button>
  );
};

export default LikeFeedButton;