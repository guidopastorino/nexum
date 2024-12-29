"use client"

import { useQueryClient } from 'react-query';
import { deletePost } from "@/utils/fetchFunctions";
import { HiOutlineTrash, HiOutlineEye, HiOutlineExclamationCircle, HiPencil, HiOutlineUsers } from 'react-icons/hi2';
import { BsBarChart, BsPerson, BsPinAngle, BsPinAngleFill, BsLink45Deg } from 'react-icons/bs';
import { MdOutlineList, MdOutlineAnalytics, MdOutlineBlock } from 'react-icons/md';
import { FaUserPlus, FaUserSlash } from 'react-icons/fa';
import Link from 'next/link';
import useToast from '@/hooks/useToast';
import { useState } from 'react';
import { TbArrowNarrowLeft } from "react-icons/tb";
import { IoPeopleOutline } from "react-icons/io5";
import { PiAtBold } from "react-icons/pi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
// current who can reply option
import { FiCheck } from "react-icons/fi";

// ------------ Menú para usuarios que no han iniciado sesión ------------
export const GuestPostMenu = ({
  postId,
  creatorUsername,
  setMenuOpen,
}: {
  postId: string;
  creatorUsername: string;
  setMenuOpen: (open: boolean) => void;
}) => {
  return (
    <>
      <Link href={`/post/${postId}/interactions`}>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <HiOutlineEye size={20} />
          <span>View post engagements</span>
        </div>
      </Link>
      <Link href={`/post/${postId}/hidden-replies`}>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <BsBarChart size={20} />
          <span>View hidden replies</span>
        </div>
      </Link>
      <Link href={`/${creatorUsername}`}>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <BsPerson size={20} />
          <span>Go to @{creatorUsername}'s profile</span>
        </div>
      </Link>
    </>
  );
};

// ------------ Menú para usuarios autenticados (cuando el usuario es el creador del post) ------------
export const DeleteItemOption = ({ postId, userId }: { postId: string; userId: string }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const handleDeletePost = async () => {
    showToast("Deleting post...");
    const res = await deletePost(postId);
    console.log(res);
    showToast("Post deleted successfully");
    queryClient.invalidateQueries(['posts']);
    queryClient.invalidateQueries(['creatorDataHoverCard', userId]);
  };

  return (
    <li className="itemClass itemHover" onClick={handleDeletePost}>
      <HiOutlineTrash size={20} />
      Delete post
    </li>
  );
};

const ChangeWhoCanReplyOption = ({ postId, setMenuOpen, setDropdownContent }: { postId: string, setMenuOpen: (open: boolean) => void, setDropdownContent: React.Dispatch<React.SetStateAction<"" | "whoCanReply">> }) => {
  return (
    <>
      <div className="itemClass" onClick={() => { setDropdownContent('whoCanReply') }}>
        <HiOutlineUsers size={20} />
        <span>Change who can reply</span>
      </div>
    </>
  )
}

export const OwnerPostMenu = ({
  postId,
  userId,
  states,
  setMenuOpen,
}: {
  postId: string;
  userId: string;
  states?: {
    isPinned?: boolean;
    isHighlighted?: boolean;
    isOnList?: boolean;
    isConversationMuted?: boolean;
  };
  setMenuOpen: (open: boolean) => void;
}) => {
  const [dropdownContent, setDropdownContent] = useState<'whoCanReply' | ''>('')

  if (!dropdownContent) {
    return (
      <>
        <DeleteItemOption postId={postId} userId={userId} />
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <HiPencil size={20} />
          <span>Edit post</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          {states?.isPinned ? <BsPinAngleFill size={20} /> : <BsPinAngle size={20} />}
          <span>{states?.isPinned ? "Unpin from your profile" : "Pin to your profile"}</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <MdOutlineAnalytics size={20} />
          <span>View post analytics</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <BsLink45Deg size={20} />
          <span>Embed post</span>
        </div>
        {/* who can reply item */}
        <ChangeWhoCanReplyOption postId={postId} setMenuOpen={setMenuOpen} setDropdownContent={setDropdownContent} />
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <MdOutlineList size={20} />
          <span>{states?.isOnList ? "Remove from Lists" : `Add to Lists`}</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <BsBarChart size={20} />
          <span>{states?.isConversationMuted ? "Unmute this conversation" : "Mute this conversation"}</span>
        </div>
      </>
    );
  }

  if (dropdownContent == 'whoCanReply') {
    return (
      <>
        <div className='flex justify-start items-center p-2 gap-2'>
          <button className='postButton' onClick={() => setDropdownContent('')} >
            <TbArrowNarrowLeft size={22} />
          </button>
          <span className="font-medium">Change who can reply</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <IoPeopleOutline size={20} />
          <span>Everyone</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <IoPersonAddOutline size={20} />
          <span>Only people you follow</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <PiAtBold size={20} />
          <span>People you mention</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <FaRegCircleCheck size={20} />
          <span>Verified account</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <IoPersonOutline size={20} />
          <span>Followers</span>
        </div>
      </>
    )
  }
};

// ------------ Menú para usuarios autenticados (cuando no son el creador del post) ------------
export const OtherUserPostMenu = ({
  postId,
  creatorUsername,
  states,
  setMenuOpen,
}: {
  postId: string;
  creatorUsername: string;
  states?: {
    isFollowing?: boolean;
    isOnList?: boolean;
    isUserMuted?: boolean;
    isBlockedMuted?: boolean;
  };
  setMenuOpen: (open: boolean) => void;
}) => {
  return (
    <>
      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        {states?.isFollowing ? <FaUserSlash size={20} /> : <FaUserPlus size={20} />}
        <span>{states?.isFollowing ? `Unfollow @${creatorUsername}` : `Follow @${creatorUsername}`}</span>
      </div>
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
        <BsBarChart size={20} />
        <span>View post engagements</span>
      </div>
      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <BsLink45Deg size={20} />
        <span>Embed post</span>
      </div>
      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <HiOutlineExclamationCircle size={20} />
        <span>Report post</span>
      </div>
      <div className="itemClass" onClick={() => setMenuOpen(false)}>
        <HiOutlineUsers size={20} />
        <span>Request Community Note</span>
      </div>
    </>
  );
};