"use client"

import PageLoader from '@/components/PageLoader';
import ShowUserProfileImage from '@/components/ShowUserProfileImage';
import { getUserData } from '@/utils/fetchFunctions';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query';
import { HiPencil } from "react-icons/hi2";
import Modal from '@/components/modal/Modal';
import useUser from '@/hooks/useUser';
import { BsThreeDots } from 'react-icons/bs';
import HashWords from '@/components/HashWords';
import { IoSearchOutline } from 'react-icons/io5';
import { useSession } from 'next-auth/react';
import UnfollowUserButton from '@/components/buttons/post/UnfollowUserButton';
import FollowUserButton from '@/components/buttons/post/FollowUserButton';
import { useFollowUser } from '@/hooks/useFollowUser';
import useToast from '@/hooks/useToast';
import AuthModal from '@/components/modal/AuthModal';
import UserProfileButtons from '@/components/buttons/UserProfileButtons';
import { StrokeLoader } from '@/components/Loader';
import PageHeader from '@/components/PageHeader';
import useTabs from '@/hooks/useTabs';
import { usePathname } from 'next/navigation';
import { UserProfile } from '@/types/types';

interface ProfileLayoutParams {
  params: { username: string };
  children: React.ReactNode;
}

// Modificar la función para incluir el tab
const formatCountAux = (count: number, singular: string, plural: string) => {
  return `${count} ${count === 1 ? singular : plural}`;
};

const formatCount = (user: UserProfile, tab: string) => {
  if (tab === 'Posts') return formatCountAux(user.postsCount, 'post', 'posts');
  if (tab === 'Replies') return formatCountAux(user.repliesCount, 'reply', 'replies');
  if (tab === 'Media') return formatCountAux(user.mediaCount, 'media', 'media');
  if (tab === 'Feeds') return formatCountAux(user.feedsCount, 'feed', 'feeds');
  if (tab === 'Communities') return formatCountAux(user.communitiesCount, 'community', 'communities');
  if (tab === 'Likes') return formatCountAux(user.feedsCount, 'like', 'likes'); // Cambié 'postsCount' por 'feedsCount' aquí, por si se refiere a los feeds en "Likes"
  return formatCountAux(user.postsCount, 'post', 'posts'); // Default "Posts"
}

const tabNames: { [key: string]: string } = {
  '': 'Posts',
  'replies': 'Replies',
  'media': 'Media',
  'feeds': 'Feeds',
  'communities': 'Communities',
  'likes': 'Likes',
};

const layout = ({ params, children }: ProfileLayoutParams) => {
  const { data: user, isLoading, error } = useQuery<UserProfile | null>(
    ['userProfile', params.username],
    () => getUserData(params.username),
    {
      enabled: !!params.username,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
    }
  );

  const pathname = usePathname();
  const currentTabKey = pathname.split('/').pop() || '';
  const currentTabName = tabNames[currentTabKey] || 'Posts';

  if (isLoading) return <div className="w-full h-full flex justify-center items-center p-5"><StrokeLoader /></div>;
  if (error) return <div>Error fetching user data</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="w-full">
      {/* header */}
      <PageHeader>
        <div className="flex flex-col justify-center items-start">
          <span className="text-xl">{user.fullname}</span>
          <span className="text-xs opacity-60">{formatCount(user, currentTabName)}</span>
        </div>
      </PageHeader>

      {/* profile view (banner, username, followers,...) */}
      <div className="relative w-full">
        {/* banner */}
        <div className='h-[150px]'>
          <ShowUserProfileImage userProfileImageUrl={user?.bannerImage!}>
            <img
              src={user?.bannerImage ? user?.bannerImage : "https://www.solidbackgrounds.com/images/1584x396/1584x396-light-sky-blue-solid-color-background.jpg"}
              className="w-full h-full object-cover"
            />
          </ShowUserProfileImage>
        </div>
        {/* user info */}
        <div className='flex flex-col justify-center items-stretch gap-2 p-4 mt-1'>
          {/* buttons */}
          <div className="w-full flex justify-end items-center gap-2">
            <UserProfileButtons userId={user._id} username={user.username} isFollowingUser={user?.isFollowingUser || false} isFollowedByUser={user?.isFollowedByUser || false} />
          </div>
          {/* fullname and username */}
          <div className="flex flex-col justify-start items-start mt-3">
            <span className='font-bold text-2xl'>{user.fullname}</span>
            <div className="flex justify-center items-center gap-2">
              <span className='opacity-80'>@{user.username}</span>
              {user.isFollowedByUser && <span className="py-1.5 px-2 text-xs dark:bg-neutral-800 bg-gray-100 rounded-full">Follows you</span>}
            </div>
          </div>
          {/* description */}
          {user.description && <HashWords text={user.description} />}
          {/* posts, followers, following */}
          <div className="flex flex-wrap gap-2 justify-start items-center">
            <div className="flex justify-center items-center gap-1">
              <span className='font-medium'>{user.postsCount}</span>
              <span className='opacity-80'>Posts</span>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className='font-medium'>{user.followersCount}</span>
              <Link href={`/${params.username}/followers`} className='opacity-80 hover:underline'>Followers</Link>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className='font-medium'>{user.followingCount}</span>
              <Link href={`/${params.username}/following`} className='opacity-80 hover:underline'>Following</Link>
            </div>
          </div>
        </div>
        {/* profile image */}
        <div className='top-28 left-3 absolute z-20'>
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg">
            <ShowUserProfileImage userProfileImageUrl={user?.profileImage ? user?.profileImage : "/default_pfp.jpg"}>
              <img
                src={user?.profileImage ? user?.profileImage : "/default_pfp.jpg"}
                className="w-full h-full object-cover object-center cursor-pointer hover:brightness-90 duration-100"
              />
            </ShowUserProfileImage>
          </div>
        </div>
      </div>

      {/* tabs (posts, media, ...) */}
      <div className="flex justify-start items-center border-y border-gray-200 dark:border-neutral-700/70 overflow-x-auto">
        <TabItem text={"Posts"} path={`/${params.username}`} />
        <TabItem text={"Replies"} path={`/${params.username}/replies`} />
        <TabItem text={"Media"} path={`/${params.username}/media`} />
        <TabItem text={"Feeds"} path={`/${params.username}/feeds`} />
        <TabItem text={"Communities"} path={`/${params.username}/communities`} />
        <TabItem text={"Likes"} path={`/${params.username}/likes`} />
      </div>

      {/* pages */}
      {children}
    </div>
  );
};

export default layout;

const TabItem = ({ text, path }: any) => {
  const pathname = usePathname()

  return (
    <Link
      href={path}
      className={`itemHover text-center px-6 py-4 inline-block shrink-0 min-w-max flex-1 ${pathname == path ? 'activeTab' : ''}`}
    >
      {text}
    </Link>
  )
}