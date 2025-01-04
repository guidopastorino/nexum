"use client"

import FeedItem from '@/components/FeedItem'
import FetchErrorRetryButton from '@/components/FetchErrorRetryButton'
import { StrokeLoader } from '@/components/Loader'
import { FeedItemProps } from '@/types/types'
import ky from 'ky'
import React from 'react'
import { useQuery } from 'react-query'

const getUserFeeds = async (username: string): Promise<FeedItemProps[]> => {
  try {
    const res = await ky.get(`/api/users/${username}/feeds`).json()
    return res as FeedItemProps[]
  } catch (error) {
    console.error("Error fetching feeds:", error);
    throw new Error("Failed to fetch feeds");
  }
}

type PageProps = {
  params: { username: string };
};

const Page: React.FC<PageProps> = ({ params }) => {
  const { username } = params;

  const { data: feeds, isLoading, isError, error } = useQuery<FeedItemProps[], Error>(
    ['userFeeds', username],
    () => getUserFeeds(username)
  );

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-5">
        <StrokeLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center p-5">
        <p className="text-red-500">There was an error loading feeds.</p>
        {error.message}
      </div>
    );
  }

  if (!feeds?.length) {
    return (
      <p className="p-5 opacity-70 text-center text-gray-500">
        @{username} has no feeds.
      </p>
    );
  }

  return (
    <div className='w-full'>
      {feeds.map((feed) => (
        <FeedItem key={feed.feedId} {...feed} />
      ))}
    </div>
  );
}

export default Page;