"use client";

import React, { useEffect, useRef, useState } from 'react';
import useUser from '@/hooks/useUser';
import { NormalPostCreationProps } from '@/types/types';
import LoggedIn from './auth/LoggedIn';
import useToast from '@/hooks/useToast';
// icons
import {
  MdOutlineImage,
  MdOutlinePoll,
  MdOutlineLocationOn,
  MdOutlineEmojiEmotions,
  MdOutlineGifBox,
  MdCalendarMonth
} from "react-icons/md";
import useScroll from '@/hooks/useScroll';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FaScissors } from 'react-icons/fa6';
import useModal from '@/hooks/useModal';
import { useCreatePost } from '@/hooks/useCreatePost';

interface CreatePostFixedButtonProps {
  trigger: any;
}

interface ModalContentProps {
  initialMedia: Array<File>;
  initialContent: string;
}

const ModalContent: React.FC<ModalContentProps> = ({ initialMedia, initialContent }) => {
  const { showToast } = useToast();

  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal('globalModal');
  
  const {
    isLoading,
    error,
    selectedFiles,
    post,
    canPost,
    setPost,
    handleMediaFilesChange,
    handleContentChange,
    handleCreatePost,
  } = useCreatePost<NormalPostCreationProps>('normal');

  const user = useUser();

  const InputMediaFiles = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Restablecer el post cuando se cierra el modal
    if (!isModalOpen) {
      setPost({
        content: '',
        media: [],
        type: 'normal',
      });
    }
  }, [isModalOpen, setPost]);

  const ScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    isFromMobile,
    scrollPosition,
    scrollToLeft,
    scrollToRight,
    showButtonLeft,
    showButtonRight
  } = useScroll(ScrollContainerRef);

  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });

  const openCropImageModal = (url: string, name: string) => {
    handleOpenModal(
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
        <img src={url} alt={name} />
      </ReactCrop>
    );
  };


  return (
    <div className="bg-white dark:bg-neutral-800 pt-2">
      {/* carousel */}
      {post?.media && post.media.length > 0 && (
        <div className="relative w-full p-2">
          {/* Botón izquierdo */}
          {!isFromMobile && showButtonLeft && (
            <button
              onClick={scrollToLeft}
              className="w-10 h-10 text-xl flex justify-center items-center absolute left-2 top-1/2 -translate-y-1/2 z-50 dark:text-white text-dark bg-white dark:bg-neutral-800 rounded-full shadow-md hover:shadow-lg"
            >
              &#8249;
            </button>
          )}

          {/* Contenedor scrollable */}
          <div
            ref={ScrollContainerRef}
            className="w-full flex justify-start items-stretch overflow-x-auto gap-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {post.media.map((el, i) => {
              const url = URL.createObjectURL(el);
              if (el.type.startsWith('image')) {
                return (
                  <div className="relative" key={i}>
                    {/* modal */}
                    <button onClick={() => openCropImageModal(url, el.name)} className='absolute top-1 left-1 z-50 rounded-full p-2 bg-black text-white'>
                      <FaScissors size={20} />
                    </button>
                    <img className='w-20 h-20 shrink-0 object-cover rounded-md shadow-sm' src={url} alt={el.name} />
                  </div>
                );
              } else {
                return (
                  <video key={i} autoPlay muted loop className='w-20 h-20 shrink-0 object-cover rounded-md shadow-sm' src={url}></video>
                );
              }
            })}
          </div>

          {/* Botón derecho */}
          {!isFromMobile && showButtonRight && (
            <button
              onClick={scrollToRight}
              className="w-10 h-10 text-xl flex justify-center items-center absolute right-2 top-1/2 -translate-y-1/2 z-50 dark:text-white text-dark bg-white dark:bg-neutral-800 rounded-full shadow-md hover:shadow-lg"
            >
              &#8250;
            </button>
          )}
        </div>
      )}

      <div className='flex justify-center items-start gap-2'>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img className='w-full h-full object-cover' src={user?.profileImage!} alt="pfp" />
        </div>

        <textarea
          onChange={handleContentChange}
          placeholder="What's on your mind?"
          className="w-full p-2 border border-gray-300 rounded-md resize-none"
          value={post.content}
        />
      </div>

      <div className='w-full flex justify-between items-center p-3 gap-3 sticky bottom-0 backdrop-blur-sm bg-white/70 dark:bg-neutral-800/70'>
        <div className="flex justify-center items-center gap-1">
          <input
            ref={InputMediaFiles}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaFilesChange}
            hidden
          />

          <button onClick={() => InputMediaFiles.current?.click()} className="postButton">
            <MdOutlineImage />
          </button>
          <button className="postButton">
            <MdOutlinePoll />
          </button>
          <button className="postButton">
            <MdOutlineLocationOn />
          </button>
          <button className="postButton">
            <MdOutlineEmojiEmotions />
          </button>
          <button className="postButton">
            <MdOutlineGifBox />
          </button>
          <button className="postButton">
            <MdCalendarMonth />
          </button>
        </div>

        <div className="flex justify-center items-center gap-2">
          <button onClick={handleCloseModal} className={`px-4 py-2 border borderColor bg-transparent rounded-full text-sm font-medium hover:brightness-90 active:brightness-75 duration-100 itemHover`}>
            Cancel
          </button>
          <button
            onClick={() => handleCreatePost('/api/posts', post as NormalPostCreationProps)}
            disabled={!canPost}
            className={`${!canPost ? "opacity-70 pointer-events-none" : ""} px-4 py-2 text-white bg-orange-600 rounded-full text-sm font-medium hover:brightness-90 active:brightness-75 duration-100`}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  )
}

const CreatePostFixedButton: React.FC<CreatePostFixedButtonProps> = ({ trigger }) => {
  const { handleOpenModal } = useModal('globalModal');

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  const openCreatePostModal = () => {
    handleOpenModal(
      <ModalContent initialContent='' initialMedia={[]} />
    );
  };

  if (!mounted) return null;

  return (
    <LoggedIn>
      {React.cloneElement(trigger, { onClick: () => openCreatePostModal() })}
    </LoggedIn>
  );
};

export default CreatePostFixedButton;