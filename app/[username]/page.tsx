import UserPostsList from '@/components/lists/UserPostsList'
import React from 'react'

const page = ({ params }: { params: { username: string } }) => {
  return (
    <UserPostsList creator={params.username} />
  )
}

export default page