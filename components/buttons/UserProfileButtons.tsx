"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { HiPencil } from "react-icons/hi2";
import { BsThreeDots } from 'react-icons/bs';
import { IoSearchOutline } from 'react-icons/io5';
import { useSession } from 'next-auth/react';
import UnfollowUserButton from '@/components/buttons/post/UnfollowUserButton';
import FollowUserButton from '@/components/buttons/post/FollowUserButton';
import { useFollowUser } from '@/hooks/useFollowUser';
import useToast from '@/hooks/useToast';
import AuthModal from '@/components/modal/AuthModal';
import LoggedOut from '../auth/LoggedOut';
import LoggedIn from '../auth/LoggedIn';
import ResponsiveMenu from '../ResponsiveMenu';
import { GuestProfileMenu, OthersProfileMenu } from '../ProfileOptionsMenu';

type UserProfileButtonsProps = {
  disableIfSameUser?: boolean;
  isFromItem?: boolean;
  userId: string; // userId of the user's profile
  username: string;
  isFollowingUser: boolean;
  isFollowedByUser: boolean;
  postId?: string;
};

const UserProfileButtons: React.FC<UserProfileButtonsProps> = ({
  disableIfSameUser = false,
  isFromItem = false,
  userId,
  username,
  isFollowingUser,
  isFollowedByUser,
  postId
}) => {
  const [initialFollowState, setInitialFollowState] = useState<boolean>(isFollowingUser || false)

  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(isFollowingUser);
  const mutation = useFollowUser(userId, isFollowing, postId);
  const { showToast } = useToast();

  const handleFollowToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // Cambio optimista
    const updatedFollowing = !isFollowing;
    setIsFollowing(updatedFollowing);
    showToast(updatedFollowing ? `Followed @${username}` : `Unfollowed @${username}`);
    mutation.mutate();
  };

  // Si no hay sesión, renderiza AuthModal o nada según disableIfSameUser
  if (!session) {
    return !disableIfSameUser ? (
      <AuthModal
        buttonTrigger={<button
          className="bg-blue-600 h-9 rounded-full py-3 px-6 text-white font-medium flex justify-center items-center"
        >
          Follow
        </button>}
      />
    ) : null;
  }

  // Si el usuario logueado es el mismo y disableIfSameUser está activado, no renderiza nada
  if (disableIfSameUser && session.user.id === userId) {
    return null;
  }

  // Si el usuario logueado es el mismo, renderiza "Editar perfil"
  if (session.user.id === userId) {
    return (
      <Link
        href={`/settings`}
        className="h-9 rounded-full py-3 px-4 gap-3 font-medium flex justify-center items-center itemHover border border-gray-200 dark:border-neutral-700/70"
      >
        <HiPencil />
        <span>Editar perfil</span>
      </Link>
    );
  }

  // Si los usuarios son distintos, renderiza Follow/Unfollow y botones adicionales
  return (
    <>
      {!isFromItem && <>
        <button className="w-9 h-9 itemHover rounded-full flex justify-center items-center border border-gray-200 dark:border-neutral-700/70">
          <IoSearchOutline />
        </button>
        {/* user profile options menu */}
        <ResponsiveMenu
          trigger={
            <button className="w-9 h-9 itemHover rounded-full flex justify-center items-center border border-gray-200 dark:border-neutral-700/70">
              <BsThreeDots />
            </button>
          }
          dropdownMenuOptions={{
            width: 300, // 300px
            canClickOtherElements: false,
          }}
        >
          {(menuOpen, setMenuOpen) => (
            <>
              {session.user?.id != userId && <OthersProfileMenu
                userId={userId}
                creatorUsername={username}
                setMenuOpen={setMenuOpen}
                states={{
                  setInitialFollowState: setInitialFollowState,
                  isFollowing: initialFollowState
                }}
              />}
            </>
          )}
        </ResponsiveMenu>
      </>}
      {isFollowing ? (
        <UnfollowUserButton onClick={e => handleFollowToggle(e)} />
      ) : (
        <FollowUserButton onClick={e => handleFollowToggle(e)} />
      )}
    </>
  );
};

export default UserProfileButtons;