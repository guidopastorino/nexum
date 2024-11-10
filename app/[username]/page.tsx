"use client"

import { IUser } from '@/types/types'
import { getUserData } from '@/utils/fetchFunctions'
import React, { useEffect, useState } from 'react'

const page = ({ params }: { params: { username: string } }) => {
  const { username } = params
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const getData = async () => {
      const res = await getUserData(username)
      console.log(res)
    }

    getData()
  }, [username])

  return (
    <div>{username}</div>
  )
}

export default page