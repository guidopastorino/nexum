"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HashWords from "@/components/HashWords";
import { FollowData } from "@/types/types";
import UserProfileButtons from "@/components/buttons/UserProfileButtons";

interface FollowItemProps {
  user: FollowData;
  disableButtonForSameUser?: boolean;
}

// componente que sirve para renderizar datos de un usuario en forma de item (sirve para la lista de seguidores y siguiendo)
const FollowItem: React.FC<FollowItemProps> = ({ user, disableButtonForSameUser = false }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/${user.username}`)}
      className="flex justify-between items-center gap-3 border-b border-gray-200 dark:border-neutral-700/70 itemHover cursor-pointer w-full pr-3"
    >
      {/* User data */}
      <div className="flex justify-center items-center gap-3 p-3">
        <img
          src={user.profileImage || "/default_pfp.jpg"}
          alt={user.fullname}
          className="w-12 h-12 rounded-full object-cover self-start"
        />
        <div>
          <p className="font-bold">{user.fullname}</p>
          <p className="text-sm opacity-50">@{user.username}</p>
          {user.description && <HashWords text={user.description} />}
        </div>
      </div>

      {/* Button */}
      <UserProfileButtons
        disableIfSameUser={disableButtonForSameUser}
        isFromItem={true}
        userId={user._id}
        username={user.username}
        isFollowingUser={user.isFollowingUser}
        isFollowedByUser={user.isFollowedByUser}
      />
    </div>
  );
};

export default FollowItem;