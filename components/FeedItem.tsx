import ResponsiveMenu from '@/components/ResponsiveMenu';
import Link from 'next/link';
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { OwnerFeedOptionsMenu } from '@/components/FeedOptionsMenu';
import LikeFeedButton from '@/components/buttons/feed/LikeFeedButton';
import { FeedItemProps } from '@/types/types';

const FeedItem: React.FC<FeedItemProps> = ({
  creatorId,
  creatorUsername,
  creatorProfileImage,
  feedMaskedId,
  feedTitle,
  feedImage,
  feedDescription,
  likedByCount,
  isFeedCreator,
  isFeedLiked
}) => {
  const [initialIsFeedLikedState, setInitialIsFeedLikedState] = useState<boolean>(isFeedLiked || false)

  return (
    <div className='border-b borderColor w-full flex flex-col items-stretch justify-center p-4'>
      {/*  */}
      <div className='w-full flex justify-between items-start'>
        <div className='flex justify-center items-center gap-4 pb-2'>
          <Link className='w-12 h-12 rounded-md overflow-hidden' href={`/feeds/${feedMaskedId}`}>
            <img className='w-full h-full object-cover' src={feedImage} alt={feedTitle} />
          </Link>
          <div className='flex flex-col justify-start items-start'>
            <Link href={`/feeds/${feedMaskedId}`} className='hover:underline'>{feedTitle}</Link>
            <div className='flex justify-start items-center gap-1 text-xs'>
              <span>Created by</span>
              {isFeedCreator ? (
                <span>you</span>
              ) : (<span className='flex justify-center items-center gap-1 rounded-sm border borderColor itemHover'>
                <img className='w-5 h-5 object-cover' src={creatorProfileImage} alt={creatorUsername} />
                <Link href={`/${creatorUsername}`} className='text-[10px] pr-1'>@{creatorUsername}</Link>
              </span>)}
            </div>
          </div>
        </div>

        {/* feed options menu */}
        {isFeedCreator ? (
          <ResponsiveMenu
            trigger={
              <button className="w-10 h-10 flex justify-center items-center itemHover">
                <BsThreeDots size={20} />
              </button>
            }
            dropdownMenuOptions={{
              width: 300, // 300px
              canClickOtherElements: false,
            }}
          >
            {(menuOpen, setMenuOpen) => (
              <OwnerFeedOptionsMenu
                creatorId={creatorId}
                creatorUsername={creatorUsername}
                feedMaskedId={feedMaskedId}
                feedTitle={feedTitle}
                setMenuOpen={setMenuOpen}
              />
            )}
          </ResponsiveMenu>
        ) : <LikeFeedButton
          feedMaskedId={feedMaskedId}
          feedTitle={feedTitle}
          initialIsFeedLikedState={initialIsFeedLikedState}
          setInitialIsFeedLikedState={setInitialIsFeedLikedState}
        />}
      </div>
      {/*  */}
      <div>
        {feedDescription}
      </div>
      {/*  */}
      <div className='text-xs opacity-70'>Liked by {likedByCount} users</div>
    </div>
  )
}

export default FeedItem;