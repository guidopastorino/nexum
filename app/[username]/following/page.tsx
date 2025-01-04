import FollowingList from '@/components/lists/FollowingList'
import React from 'react'

const page = ({ params }: { params: { username: string } }) => {
  return (
    <FollowingList userId={params.username} />
  )
}

export default page