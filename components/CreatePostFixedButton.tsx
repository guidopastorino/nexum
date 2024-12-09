"use client"

import React, { useEffect, useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs';
import { createPortal } from 'react-dom';
import Modal from './modal/Modal';
import useUser from '@/hooks/useUser';
import { MediaFile } from '@/types/types';
import LoggedIn from './auth/LoggedIn';
import { createPost } from '@/utils/fetchFunctions';
import { useQueryClient } from 'react-query';
import useToast from '@/hooks/useToast';

// The necessary props to create a post (normal)
export interface PostCreationProps {
  creator: string;
  content: string;
  media: MediaFile[];
  type: string;
}

const CreatePostFixedButton = () => {
  const user = useUser()

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [post, setPost] = useState<PostCreationProps>({
    creator: user._id || "",
    content: "",
    media: [],
    type: "normal",
  })

  const [canPost, setCanPost] = useState<boolean>(false)

  useEffect(() => {
    setCanPost(!!post.content.length);
  }, [post.content]);

  const { showToast } = useToast()

  const handleCreatePost = async () => {
    setIsLoading(true);
    const res = await createPost(post);
    showToast((res as any).message)
    queryClient.invalidateQueries(['posts']);
    queryClient.invalidateQueries(['creatorDataHoverCard', user?._id]);
    setIsLoading(false);
  }

  return (
    <LoggedIn>
      {
        createPortal(
          <Modal buttonTrigger={<button className="fixed bottom-5 right-5 w-12 h-12 flex justify-center items-center rounded-full text-white shadow-lg bg-orange-600">
            <BsPencilSquare />
          </button>}>
            <div className="bg-white dark:bg-neutral-800 pt-2">
              {/* threading */}
              <div className="w-full">
                <ExampleThreadPost profileImage={user.profileImage || ""} setPost={setPost} />
              </div>

              <div className='w-full flex justify-end items-center p-3 sticky bottom-0 backdrop-blur-sm bg-white/70 dark:bg-neutral-800/70'>
                <button onClick={handleCreatePost} disabled={!canPost} className={`${!canPost ? "opacity-70 pointer-events-none" : ""} px-4 py-2 text-white bg-orange-600 rounded-full text-sm font-medium hover:brightness-90 active:brightness-75 duration-100`}>
                  {isLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </Modal>,
          document.body
        )
      }
    </LoggedIn>
  )
}

export default CreatePostFixedButton

interface ExampleThreadPostProps {
  profileImage: string;
  setPost: React.Dispatch<React.SetStateAction<PostCreationProps>>;
}

// add thread style (line connecting)
// change state setCanPost to all posts (threads) at the time
const ExampleThreadPost = ({ profileImage, setPost }: ExampleThreadPostProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setPost((prev) => ({ ...prev, content }));
  }

  return (
    <div className='w-full flex justify-center items-start p-2 gap-2'>
      <div className='self-start'>
        <img className='w-10 h-10 object-cover rounded-full' src={profileImage} alt='profile image' />
      </div>
      <div className='w-full flex-1'>
        <textarea
          onChange={handleChange}
          className='w-full p-2 rounded-md border dark:border-neutral-800 border-gray-500 bg-transparent'
          placeholder='What are you thinking!?'
        />
      </div>
    </div>
  )
}
