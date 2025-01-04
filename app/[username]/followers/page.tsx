import FollowersList from '@/components/lists/FollowersList'
import React from 'react'

const page = ({ params }: { params: { username: string } }) => {
  return (
    <FollowersList userId={params.username} />
  )
}

export default page