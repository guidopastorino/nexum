"use client"

import ky from 'ky';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Loader, { StrokeLoader } from './Loader';
import { FaCircleCheck } from "react-icons/fa6";
import { UserProfile } from '@/types/types';
import HoverCard from './HoverCard';
import UserProfileButtons from './buttons/UserProfileButtons';
import Link from 'next/link';
import HashWords from './HashWords';

const fetchCreatorData = async (creatorId: string): Promise<UserProfile> => {
  try {
    const res = await ky.get(`/api/users/${creatorId}`).json();
    return res as UserProfile;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching creator data'); // Lanza un error para manejarlo en useQuery
  }
};

interface HoverCardProps {
  children: React.ReactNode; // trigger element
  creatorId: string;
}

const UserDetailsProfileCard: React.FC<HoverCardProps> = ({ children, creatorId }) => {
  const { data: session } = useSession()

  const [isHovered, setIsHovered] = useState(false);

  // Fetch creator data only if hover card is open
  const { data: creatorData, isLoading, error } = useQuery<UserProfile, Error>(
    ['creatorDataHoverCard', creatorId],
    () => fetchCreatorData(creatorId),
    {
      // enabled: isHovered && !!session?.user.id
      enabled: isHovered,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // if(!session) return children;

  return (
    <HoverCard
      trigger={children}
      positionX="center"
      width={275}
      onHoverChange={setIsHovered}
    >
      <div>
        {isLoading && <div className="div p-3 flex justify-center items-center"><StrokeLoader size={20} /></div>}

        {creatorData && <>
          <div className="relative w-full cursor-auto">
            <div className='flex flex-col justify-center items-stretch gap-2 p-4 mt-1'>
              <div className="w-full flex justify-between items-start gap-2">
                <img
                  src={creatorData.profileImage ? creatorData.profileImage : "/default_pfp.jpg"}
                  className="w-14 h-14 rounded-full overflow-hidden shadow-lg object-cover object-center cursor-pointer hover:brightness-90 duration-100"
                />
                <UserProfileButtons
                  disableIfSameUser={true}
                  isFromItem={true}
                  userId={creatorData._id}
                  username={creatorData.username}
                  isFollowingUser={creatorData.isFollowingUser || false}
                  isFollowedByUser={creatorData.isFollowedByUser || false}
                />
              </div>
              <div className="flex flex-col justify-start items-start">
                <span className='font-bold text-lg'>{creatorData.fullname}</span>
                <div className="flex justify-center items-center gap-2">
                  <span className='opacity-80 text-sm'>@{creatorData.username}</span>
                  {creatorData.isFollowedByUser && <span className="py-1.5 px-2 text-xs dark:bg-neutral-800 bg-gray-100 rounded-full">Follows you</span>}
                </div>
              </div>
              {creatorData.description && <HashWords text={creatorData.description} />}
              <div className="flex flex-wrap gap-2 justify-start items-center">
                <div className="flex justify-center items-center gap-1">
                  <span className='font-medium'>{creatorData.followersCount}</span>
                  <Link href={`/${creatorData.username}/followers`} className='opacity-80 hover:underline'>Followers</Link>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <span className='font-medium'>{creatorData.followingCount}</span>
                  <Link href={`/${creatorData.username}/following`} className='opacity-80 hover:underline'>Following</Link>
                </div>
              </div>
            </div>
          </div>
        </>}
      </div>
    </HoverCard>
  );
};

export default UserDetailsProfileCard;