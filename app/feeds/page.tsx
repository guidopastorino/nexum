"use client"

import AsideRight from '@/components/AsideRight'
import Modal from '@/components/modal/Modal';
import ResponsiveMenu from '@/components/ResponsiveMenu';
import Link from 'next/link';
import React, { useRef, useState } from 'react'
import { BsInfoCircle, BsLine, BsPlus, BsThreeDots } from 'react-icons/bs';
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { uploadFiles } from '@/actions/uploadFiles';
import ky from 'ky';
import { useQuery, useQueryClient } from 'react-query';
import { StrokeLoader } from '@/components/Loader';
import FetchErrorRetryButton from '@/components/FetchErrorRetryButton';
import { OwnerFeedOptionsMenu } from '@/components/FeedOptionsMenu';
import LikeFeedButton from '@/components/buttons/feed/LikeFeedButton';
import { FeedItemProps } from '@/types/types';
import FeedItem from '@/components/FeedItem';
import { useSession } from 'next-auth/react';
import PageHeader from '@/components/PageHeader';

// devuelve los feeds del usuario actual logeado
const fetchUserFeeds = async (): Promise<FeedItemProps[]> => {
  const response = await ky.get('/api/feeds/user-feeds').json();
  return response as FeedItemProps[];
};

// devuelve feeds recomendados para el usuario
const fetchRecommendedFeeds = async (): Promise<FeedItemProps[]> => {
  const response = await ky.get('/api/feeds').json();
  return response as FeedItemProps[];
};

const page = () => {
  // Fetching user feeds and recommended feeds
  const { data: userFeeds, error: userFeedsError, isLoading: userFeedsLoading } = useQuery<FeedItemProps[], Error>(
    'userFeeds',
    fetchUserFeeds,
  );
  const { data: recommendedFeeds, error: recommendedFeedsError, isLoading: recommendedFeedsLoading } = useQuery<FeedItemProps[], Error>(
    'recommendedFeeds',
    fetchRecommendedFeeds,
  );

  if (userFeedsLoading || recommendedFeedsLoading) {
    return <div className="w-full flex justify-center items-center p-5">
      <StrokeLoader />
    </div>
  }

  if (userFeedsError || recommendedFeedsError) {
    return <FetchErrorRetryButton />;
  }

  return (
    <>
      <div className='w-full'>
        <PageHeader>
          <div className="flex justify-between items-center gap-3">
            <span className='text-xl'>Feeds</span>
            <CreateNewFeedButton />
          </div>
        </PageHeader>

        <span className="text-2xl font-medium block p-4 border-b borderColor">Tus Feeds</span>
        {/* Render user's feeds */}
        {userFeeds && userFeeds.length > 0 ? (
          userFeeds.map((feed: FeedItemProps) => (
            <FeedItem
              key={feed.feedId}
              {...feed}
            />
          ))
        ) : (
          <div>No user feeds found.</div>
        )}

        <span className="text-2xl font-medium block p-4 border-b borderColor">Explorar nuevos feeds</span>
        {/* Render recommended feeds */}
        {recommendedFeeds && recommendedFeeds.length > 0 ? (
          recommendedFeeds.map((feed: FeedItemProps) => (
            <FeedItem
              key={feed.feedId}
              {...feed}
            />
          ))
        ) : (
          <div>No feeds found for exploration.</div>
        )}

        <div className='h-[50dvh]'></div>
      </div>

      <AsideRight>
        aside
      </AsideRight>
    </>
  )
}

export default page

const CreateNewFeedButton = () => {
  const queryClient = useQueryClient()

  const { data: session } = useSession()

  const [feedPicture, setFeedPicture] = useState<File | null>(null);
  const InputFeedPicture = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setFeedPicture(file);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      privacy: "public" as "public" | "private",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Feed title is required"),
      description: Yup.string()
        .required("Feed description is required")
        .max(50, "Description cannot exceed 50 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        let uploadedPicture = null;

        if (feedPicture) {
          const formData = new FormData();
          formData.append("files", feedPicture);

          // Simulación de carga de imagen
          const uploadResponse = await uploadFiles(formData)

          uploadedPicture = (uploadResponse as any)[0].data.url
        }

        await ky.post("/api/feeds", {
          json: {
            ...values,
            feedPicture: uploadedPicture || "/default_pfp.jpg",
          },
        });

        queryClient.invalidateQueries(['userFeeds', session?.user.id])
        alert("Feed created successfully!");
        resetForm();
        setFeedPicture(null);
      } catch (error) {
        console.error("Error creating feed:", error);
        alert("Failed to create feed. Please try again.");
      }
    },
  });

  return (
    <Modal
      buttonTrigger={
        <div className="w-10 h-10 flex justify-center items-center itemHover">
          <BsPlus size={24} />
        </div>
      }
      width={500}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white dark:bg-neutral-800 p-4">
          <span className="text-2xl font-medium block border-b borderColor pb-2 mb-4">
            Create new feed
          </span>
          <span className="my-3 text-sm opacity-80 block">
            Custom feeds allow users to create personalized feeds based on multiple communities, meaning all the content
            is in one place. Custom feeds are great for grouping communities that are about the same topic.
          </span>
          <div className="flex gap-4">
            <input
              ref={InputFeedPicture}
              onChange={handleInputChange}
              type="file"
              accept="image/*"
              hidden
            />
            <img
              onClick={() => InputFeedPicture.current?.click()}
              className="w-20 h-20 rounded-sm object-cover shrink-0 cursor-pointer hover:brightness-90 duration-100"
              src={feedPicture ? URL.createObjectURL(feedPicture) : "/default_pfp.jpg"}
              alt="feed picture"
            />
            <div className="flex-1">
              <input
                id="title"
                name="title"
                className={`formInput bg-transparent ${formik.touched.title && formik.errors.title ? "border-red-500" : ""
                  }`}
                type="text"
                placeholder="Feed title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
              {formik.touched.title && formik.errors.title && (
                <span className="text-red-500 text-sm">{formik.errors.title}</span>
              )}
              <textarea
                id="description"
                name="description"
                className={`formInput mt-4 bg-transparent ${formik.touched.description && formik.errors.description ? "border-red-500" : ""
                  }`}
                placeholder="Feed description"
                maxLength={50}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <span className="text-red-500 text-sm">{formik.errors.description}</span>
              )}
              <span className="my-2 block">Privacy</span>
              <div className="grid grid-cols-2 border borderColor rounded-md">
                <div
                  onClick={() => formik.setFieldValue("privacy", "public")}
                  className={`${formik.values.privacy === "public" ? "bg-gray-100 dark:bg-neutral-700/50" : ""
                    } flex justify-center items-center cursor-pointer itemHover p-2`}
                >
                  Public
                </div>
                <div
                  onClick={() => formik.setFieldValue("privacy", "private")}
                  className={`${formik.values.privacy === "private" ? "bg-gray-100 dark:bg-neutral-700/50" : ""
                    } flex justify-center items-center cursor-pointer itemHover p-2`}
                >
                  Private
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-end mt-4">
            <button
              type="submit"
              className="px-3 py-2 rounded-md bg-orange-700 hover:brightness-90 active:brightness-85 duration-100"
            >
              Create feed
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};