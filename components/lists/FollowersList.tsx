"use client";

import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getUserFollowers } from "@/utils/fetchFunctions";
import FollowItem from "./items/FollowItem";
import { FollowData } from "@/types/types";
import { StrokeLoader } from "../Loader";

interface FollowersListProps {
  userId: string;
}

const FollowersList: React.FC<FollowersListProps> = ({ userId }) => {
  const { data: followers, isLoading, error } = useQuery<FollowData[], Error>(
    ["userFollowers", userId],
    () => getUserFollowers(userId),
    {
      enabled: !!userId,
      // staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );

  useEffect(() => {
    console.log({ followers });
  }, [followers]);

  if (isLoading) return <div className="w-full flex justify-center items-center p-5">
    <StrokeLoader />
  </div>;
  if (error) return <div>Error fetching followers</div>;
  if (!followers || followers.length === 0) return <p className="p-5 opacity-70 text-center text-gray-500">
    No followers to show
  </p>;

  return (
    <div className="followers-list">
      {followers.map((follower) => (
        <FollowItem key={follower._id} user={follower} disableButtonForSameUser={true} />
      ))}
    </div>
  );
};

export default FollowersList;
