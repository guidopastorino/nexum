"use client"

import React, { useEffect, useRef, useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs';
import { IoIosArrowBack, IoMdArrowForward } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import { createPortal } from 'react-dom';
import Modal from './modal/Modal';
import useUser from '@/hooks/useUser';
import { MediaFile, UserState } from '@/types/types';
import LoggedIn from './auth/LoggedIn';
import { createPost } from '@/utils/fetchFunctions';
import { useQueryClient } from 'react-query';
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
import { uploadFiles } from '@/actions/uploadFiles';
import { useSession } from 'next-auth/react';
import useScroll from '@/hooks/useScroll';
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { FaScissors } from 'react-icons/fa6';

// The necessary props to create a post (normal)
export interface PostCreationProps {
  content: string;
  media: File[];
  type: string;
}

interface CreatePostFixedButtonProps {
  trigger: any;
}

const CreatePostFixedButton: React.FC<CreatePostFixedButtonProps> = ({ trigger }) => {
  // 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnCloseModal = () => setIsModalOpen(false)

  const user = useUser()
  const { data: session } = useSession()

  const InputMediaFiles = useRef<HTMLInputElement | null>(null);

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => setMounted(true), [])

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { showToast } = useToast()

  const [post, setPost] = useState<PostCreationProps>({
    content: "",
    media: [],
    type: "normal",
  })

  const [canPost, setCanPost] = useState<boolean>(false)

  // se puede postear si el contenido no es vacio o la longitud de los archivos no es 0 
  useEffect(() => {
    setCanPost(!!post.content.length || !!post.media.length);
  }, [post.content, post.media]);


  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Agregar todos los archivos al FormData
      post.media.forEach((file) => {
        formData.append("files", file);
      });

      // Subir los archivos al servidor
      const uploadResponse = await uploadFiles(formData);

      // Extraer las URLs de los archivos subidos
      const filesToBeUploaded = uploadResponse.map((res: any) => res.data);

      const newPost = {
        content: post.content,
        media: filesToBeUploaded,
        type: post.type
      }

      // Crear el post con el contenido actualizado
      const res = await createPost(newPost);

      showToast((res as any).message ?? (res as any).error);

      setPost({ content: '', media: [], type: 'normal' })

      // Invalidar caché
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['creatorDataHoverCard', session?.user?.id]);
      queryClient.invalidateQueries(['userProfile', session?.user?.id]);
      queryClient.invalidateQueries(['userPosts', session?.user?.id], { refetchActive: true, refetchInactive: true });

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const files = Array.from(event.target.files);

    setPost((prev) => ({
      ...prev,
      media: [...prev.media, ...files],
      // media: files
    }));
  };

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
  })

  if (!mounted) return null;

  return (
    <LoggedIn>
      {
        <Modal
          width={500}
          buttonTrigger={trigger}
          onClose={handleOnCloseModal}
          closeOnDarkClick={false} // Aquí no se cierra al hacer click fuera
        >
          <div className="bg-white dark:bg-neutral-800 pt-2">
            {/* carousel */}
            {post.media.length > 0 && <div className="relative w-full p-2">
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
                <>
                  {post.media.map((el, i) => {
                    const url = URL.createObjectURL(el)
                    if (el.type.startsWith('image')) {
                      return (
                        <div className="relative">
                          <Modal
                            buttonTrigger={<button className='absolute top-1 left-1 z-50 rounded-full p-2 bg-black text-white'>
                              <FaScissors size={20} />
                            </button>}
                            onClose={handleOnCloseModal}
                            closeOnDarkClick={true} // Este modal sí se cierra al hacer click fuera
                          >
                            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                              <img src={url} alt={el.name} />
                            </ReactCrop>
                          </Modal>
                          <img className='w-20 h-20 shrink-0 object-cover rounded-md shadow-sm' src={url} alt={el.name} />
                        </div>
                      )
                    } else {
                      return (
                        <video autoPlay muted loop className='w-20 h-20 shrink-0 object-cover rounded-md shadow-sm' src={url}></video>
                      )
                    }
                  })}
                </>
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
            </div>}

            {/* threading */}
            <div className="w-full">
              <ExampleThreadPost profileImage={user.profileImage || ""} setPost={setPost} />
            </div>

            <div className="bg-red-800 text-white flex justify-start items-start gap-2 p-2 rounded-md m-3">
              <FiAlertTriangle className='shrink-0' size={25} />
              <span className='text-sm'>Please note that videos may take longer to upload, and the preferred size is 4MB (or less than 2 minutes long).</span>
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
                <button onClick={handleOnCloseModal} className={`px-4 py-2 border borderColor bg-transparent rounded-full text-sm font-medium hover:brightness-90 active:brightness-75 duration-100 itemHover`}>
                  Cancel
                </button>
                <button onClick={handleCreatePost} disabled={!canPost} className={`${!canPost ? "opacity-70 pointer-events-none" : ""} px-4 py-2 text-white bg-orange-600 rounded-full text-sm font-medium hover:brightness-90 active:brightness-75 duration-100`}>
                {isLoading ? "Posting..." : "Post"}
              </button>
              </div>
            </div>
          </div>
        </Modal>
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
    <div className='w-full flex justify-center items-start p-3 gap-2'>
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
