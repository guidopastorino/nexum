import React from 'react'
import { PostProps } from '@/types/types'

const Post = ({ creatorId, }: PostProps) => {
  return (
    <div role='article' className='w-full p-2 flex justify-center items-start border-y border-gray-100'>
      {creatorId}
    </div>
  )
}

export default Post