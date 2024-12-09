"use client"

import { PostProps } from '@/types/types'
import { getUserPosts } from '@/utils/fetchFunctions'
import React from 'react'
import { useQuery } from 'react-query'
import Loader from '../Loader'
import Post from '../Post'

// Displays all user's posts (from the user profile page)
const PostsList = ({ creator }: { creator: string }) => {
  const { data: posts, isLoading, error } = useQuery<PostProps[], Error>(
    ['userPosts', creator],
    () => getUserPosts(creator),
    {
      enabled: !!creator,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
    },
  )

  if (error) {
    return <div>Error loading posts: {error.message}</div>
  }

  if (isLoading) {
    return <Loader />
  }

  if (!posts?.length) {
    return <div className='w-full h-full flex justify-center items-start px-3 py-5 opacity-70'>@{creator} hasn't posted yet</div>
  }

  return (
    <div>
      {posts.map(post => (
        <Post key={post._id} {...post} />
      ))}
    </div>
  )
}

export default PostsList