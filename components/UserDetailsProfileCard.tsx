"use client"

import ky from 'ky';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Loader from './Loader';
import { FaCircleCheck } from "react-icons/fa6";
import * as HoverCard from "@radix-ui/react-hover-card";


// // response
interface IUser {
  _id: string,
  fullname: string,
  username: string,
  isVerified: boolean;
  profileImage: string,
  createdAt: Date,
  updatedAt: Date,
  postsCount: number,
  followersCount: number,
  followingCount: number,
  isFollowingUser: boolean,
}

const fetchCreatorData = async (creatorId: string, userId: string): Promise<IUser> => {
  try {
    const res = await ky.get(`/api/users/${creatorId}?&userId=${userId}`).json();
    return res as IUser;
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
  const [open, setOpen] = useState<boolean>(false);

  const { data: session } = useSession()

  const { data: creatorData, isLoading, error } = useQuery<IUser>(
    ['creatorDataHoverCard', creatorId],
    () => fetchCreatorData(creatorId, session?.user.id),
    {
      enabled: !!session?.user?.id && open,
      staleTime: 1000 * 60 * 5, // Los datos se mantienen frescos durante 5 minutos
      cacheTime: 1000 * 60 * 10, // Los datos se mantendrán en caché por 10 minutos antes de ser eliminados
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <HoverCard.Root open={open} onOpenChange={setOpen}>
      <HoverCard.Trigger>
        {children}
      </HoverCard.Trigger>
      <HoverCard.Content
        className={`HoverCardContent bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden w-64 transition-opacity z-50`}
        sideOffset={5}
      >
        <div>
          {isLoading && <Loader width={20} height={20} />}

          {creatorData && <>
            {/* banner and pfp */}
            <div className="relative w-full h-20">
              <img className='w-full object-cover rounded-b-lg' src='https://thumb.ac-illust.com/de/de03943d3658e11b1f2331796927b26e_t.jpeg' />
              <div className='absolute top-[70%] left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden shadow-lg'>
                <img src={creatorData.profileImage} className='w-full h-full' />
              </div>
            </div>
            {/* user info */}
            <div className='px-2 pt-12 pb-3 flex flex-col justify-center items-center'>
              <div className="flex justify-center items-center gap-2">
                <span>{creatorData.fullname}</span>
                <FaCircleCheck className='text-orange-600' />
              </div>
              {/*  */}
              <span className='opacity-50 text-sm my-2 block'>@{creatorData.username}</span>
              {/*  */}
              <div className="flex flex-wrap justify-start items-center gap-2">
                <div className='flex justify-center items-center gap-1 text-sm'>
                  <span className='font-bold'>{creatorData.postsCount}</span>
                  <span className='opacity-70'>Posts</span>
                </div>
                <div className='flex justify-center items-center gap-1'>
                  <span className='font-bold'>{creatorData.followersCount}</span>
                  <span className='opacity-70'>Followers</span>
                </div>
                <div className='flex justify-center items-center gap-1'>
                  <span className='font-bold'>{creatorData.followingCount}</span>
                  <span className='opacity-70'>Following</span>
                </div>
              </div>
            </div>
          </>}
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  );
};

export default UserDetailsProfileCard;