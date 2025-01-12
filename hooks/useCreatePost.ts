"use client"

import { useEffect, useRef, useState } from 'react';
import ky from 'ky';
import { MediaFile, NormalPostCreationProps, QuotePostCreationProps, ReplyPostCreationProps } from '@/types/types';
import { uploadFiles } from '@/actions/uploadFiles';
import useToast from './useToast';
import { useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';

type PostType = 'normal' | 'quote' | 'reply';

export const useCreatePost = <T extends NormalPostCreationProps | QuotePostCreationProps | ReplyPostCreationProps>(
  initialType: PostType, postId?: string
) => {
  const getInitialPostState = (postId?: string): T => {
    switch (initialType) {
      case 'quote':
        return {
          content: '',
          media: [],
          quotedPost: postId ? postId : '',
          type: 'quote',
        } as unknown as T;
      case 'reply':
        return {
          parentPost: '',
          content: '',
          media: [],
          type: 'reply',
        } as unknown as T;
      case 'normal':
      default:
        return {
          content: '',
          media: [],
          type: 'normal',
        } as unknown as T;
    }
  };

  const [post, setPost] = useState<T>(getInitialPostState(postId));

  useEffect(() => console.log(post), [post])

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [canPost, setCanPost] = useState<boolean>(false);

  const { data: session } = useSession();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setCanPost(!!post.content.length || !!post.media.length);
  }, [post.content, post.media]);

  const handleMediaFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const filesArray = Array.from(event.target.files);
    setPost((prev) => ({ ...prev, media: filesArray }));
    setSelectedFiles(filesArray);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setPost((prev) => ({ ...prev, content }));
  };

  const handleCreatePost = async (url: string, body: T) => {
    setIsLoading(true);
    setError(null);

    if (!post || !canPost) throw new Error("Cannot create post");

    try {
      const formData = new FormData();
      post.media.forEach((file) => formData.append("files", file));
      const uploadResponse = await uploadFiles(formData);
      const filesToBeUploaded = uploadResponse.map((res: any) => res.data);

      const mediaFiles: MediaFile[] = filesToBeUploaded.map((file: any) => ({
        name: file.name,
        key: file.key,
        url: file.url,
        type: file.type,
      }));

      const finalPost = {
        ...post,
        media: mediaFiles,
      };

      const res = await ky.post(url, { json: finalPost }).json();

      showToast((res as any).message ?? (res as any).error);

      queryClient.invalidateQueries(['posts', session?.user.id]);
      queryClient.invalidateQueries(['creatorDataHoverCard', session?.user?.id]);
      queryClient.invalidateQueries(['userProfile', session?.user?.id]);
      queryClient.invalidateQueries(['userPosts', session?.user?.id], { refetchActive: true, refetchInactive: true });

      return res;
    } catch (err: any) {
      setError(err.message || 'Error al crear el post');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    selectedFiles,
    post,
    canPost,
    setPost,
    handleMediaFilesChange,
    handleContentChange,
    handleCreatePost,
  };
};