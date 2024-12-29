"use client"

import PageLoader from '@/components/PageLoader';
import ShowUserProfileImage from '@/components/ShowUserProfileImage';
import { getUserData } from '@/utils/fetchFunctions';
import Link from 'next/link';
import React from 'react'
import { useQuery } from 'react-query';
import { HiPencil } from "react-icons/hi2";
import Modal from '@/components/modal/Modal';

interface ProfileLayoutParams {
  params: { username: string };
  children: React.ReactNode;
}

const layout = ({ params, children }: ProfileLayoutParams) => {
  const { data: user, isLoading, error } = useQuery(
    ['userProfile', params.username],
    () => getUserData(params.username),
    {
      enabled: !!params.username,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
    },
  );

  if (isLoading) return <PageLoader />;

  if (error) return <div>Error fetching user data</div>

  return (
    <div className="w-full">
      <div className="relative w-full pb-[30%] left-0 -top-3">
        <img
          src={user?.bannerImage ? user?.bannerImage : "https://www.solidbackgrounds.com/images/1584x396/1584x396-light-sky-blue-solid-color-background.jpg"}
          className="absolute top-0 w-full object-cover h-full rounded-b-lg"
        />
        <Modal buttonTrigger={<button className='w-10 h-10 rounded-full flex justify-center items-center text-lg absolute top-2 right-2 z-40'>
          <HiPencil />
        </button>}>
          <div className="p-5 w-full max-w-screen-lg bg-white dark:bg-neutral-800">
            <div className='pb-3 border-b'>
              <span className='font-medium text-xl'>Edit profile</span>
            </div>

          </div>
        </Modal>
        <div className='z-30 absolute flex justify-start items-end left-3 top-[85%] gap-2'>
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg">
            <ShowUserProfileImage userProfileImageUrl={user?.profileImage ? user?.profileImage : "/default_pfp.jpg"}>
              <img
                src={user?.profileImage ? user?.profileImage : "/default_pfp.jpg"}
                className="w-full h-full object-cover object-center cursor-pointer hover:brightness-90 duration-100"
              />
            </ShowUserProfileImage>
          </div>
          <div className='dark:text-white text-black flex flex-col justify-center items-start'>
            <span className='font-bold text-lg'>{user?.fullname}</span>
            <span className='opacity-70'>@{user?.username}</span>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-24">
        <div className="grid grid-cols-5">
          <Link href={`/${params.username}/`} className='itemHover text-center p-3 inline-block'>Posts</Link>
          <Link href={`/${params.username}/media`} className='itemHover text-center p-3 inline-block'>Media</Link>
          <Link href={`/${params.username}/feeds`} className='itemHover text-center p-3 inline-block'>Feeds</Link>
          <Link href={`/${params.username}/communities`} className='itemHover text-center p-3 inline-block'>Communities</Link>
          <Link href={`/${params.username}/likes`} className='itemHover text-center p-3 inline-block'>Likes</Link>
        </div>

        {/* pages */}
        {children}
      </div>
    </div >
  )
}

export default layout