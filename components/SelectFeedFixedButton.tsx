"use client"

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import Modal from './modal/Modal';
import useUser from '@/hooks/useUser';
import LoggedIn from './auth/LoggedIn';
import { useQueryClient } from 'react-query';
import useToast from '@/hooks/useToast';
import { RiFileListLine } from 'react-icons/ri';

const SelectFeedFixedButton = () => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => setMounted(true), [])

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [feeds, setFeeds] = useState<string[]>([])

  const { showToast } = useToast()

  if (!mounted) return null;

  return (
    <LoggedIn>
      {
        createPortal(
          <Modal width={400} buttonTrigger={<button className="fixed bottom-20 right-5 w-12 h-12 flex justify-center items-center rounded-full shadow-lg bg-white dark:bg-neutral-700 border dark:border-neutral-700 hover:brightness-90 duration-100">
            <RiFileListLine />
          </button>}>
            <div className="bg-white dark:bg-neutral-800">
              <div className='p-2 border-b dark:border-neutral-700 border-gray-200'>
                <span className='font-medium text-xl'>Select feed</span>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="itemHover itemClass">Feed {i}</div>
              ))}
            </div>
          </Modal>,
          document.body
        )
      }
    </LoggedIn>
  )
}

export default SelectFeedFixedButton;