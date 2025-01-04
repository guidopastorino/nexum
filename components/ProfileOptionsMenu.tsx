"use client"

import { HiOutlineExclamationCircle, HiOutlineEye, HiOutlineShare } from 'react-icons/hi2';
import { BsLink45Deg, BsPerson } from 'react-icons/bs';
import Link from 'next/link';
import { MdOutlineBlock, MdOutlineList } from 'react-icons/md';
import { FollowUserOption } from './PostItemsComponent';
import { useState } from 'react';
import { FaUserSlash } from 'react-icons/fa';


// for users not logged (for now it is unusable)
export const GuestProfileMenu = ({
  creatorUsername,
  setMenuOpen,
}: {
  creatorUsername: string;
  setMenuOpen: (open: boolean) => void;
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${creatorUsername}`);
    setMenuOpen(false);
    alert("Profile link copied to clipboard!");
  };

  return (
    <>
      <div className="itemClass" onClick={copyToClipboard}>
        <BsLink45Deg size={20} />
        <span>Copy profile link</span>
      </div>

      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <HiOutlineShare size={20} />
        <span>Share profile</span>
      </div>

      <Link href={`/${creatorUsername}/posts`}>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <HiOutlineEye size={20} />
          <span>Explore posts</span>
        </div>
      </Link>

      <Link href={`/${creatorUsername}/lists`}>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <MdOutlineList size={20} />
          <span>View public lists</span>
        </div>
      </Link>

      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <BsPerson size={20} />
        <span>View bio</span>
      </div>

      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <HiOutlineExclamationCircle size={20} />
        <span>Report profile</span>
      </div>
    </>
  );
};


// View Topics
// Add/remove @MilesXpisti from Lists
// View Lists
// Share profile via...
// Copy link to profile
// Mute @MilesXpisti
// Block @MilesXpisti
// Report @MilesXpisti

export const OthersProfileMenu = ({
  userId,
  creatorUsername,
  states,
  setMenuOpen,
}: {
  userId: string;
  creatorUsername: string;
  states?: {
    isFollowing?: boolean;
    setInitialFollowState?: React.Dispatch<React.SetStateAction<boolean>>;
    isOnList?: boolean;
    isUserMuted?: boolean;
    isBlocked?: boolean;
  };
  setMenuOpen: (open: boolean) => void;
}) => {

  return (
    <>
      <FollowUserOption
        userId={userId}
        creatorUsername={creatorUsername}
        isFollowing={states?.isFollowing || false}
        setInitialFollowState={states?.setInitialFollowState!}
        setMenuOpen={setMenuOpen}
      />
      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <MdOutlineList size={20} />
        <span>{states?.isOnList ? "Remove from Lists" : `Add to Lists`}</span>
      </div>
      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <FaUserSlash size={20} />
        <span>{states?.isUserMuted ? `Unmute @${creatorUsername}` : `Mute @${creatorUsername}`}</span>
      </div>
      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <MdOutlineBlock size={20} />
        <span>Block @{creatorUsername}</span>
      </div>
      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <HiOutlineExclamationCircle size={20} />
        <span>Report user</span>
      </div>
    </>
  );
};