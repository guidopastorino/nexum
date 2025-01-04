"use client";

import React from "react";
import { useQuery } from "react-query";
import { getUserFollowing } from "@/utils/fetchFunctions";
import FollowItem from "./items/FollowItem";
import { FollowData } from "@/types/types";
import { StrokeLoader } from "../Loader";

interface FollowingListProps {
  userId: string;
}

const FollowingList: React.FC<FollowingListProps> = ({ userId }) => {
  const { data, isLoading, error } = useQuery<FollowData[], Error>(
    ["userFollowing", userId],
    () => getUserFollowing(userId),
    {
      enabled: !!userId,
      // staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );

  if (isLoading) return <div className="w-full flex justify-center items-center p-5">
    <StrokeLoader />
  </div>;
  if (error) return <div>Error fetching following</div>;
  if (!data || data.length === 0) return <p className="p-5 opacity-70 text-center text-gray-500">
    No following users to show
  </p>;

  return (
    <div className="following-list">
      {data.map((following) => (
        <FollowItem key={following._id} user={following} disableButtonForSameUser={true} />
      ))}
    </div>
  );
};

export default FollowingList;