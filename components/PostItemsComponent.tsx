"use client"

import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { deleteNormalPost, deleteQuotePost } from "@/utils/fetchFunctions";
import { HiOutlineTrash, HiOutlineEye, HiOutlineExclamationCircle, HiPencil, HiOutlineUsers } from 'react-icons/hi2';
import { BsBarChart, BsPerson, BsPinAngle, BsPinAngleFill, BsLink45Deg } from 'react-icons/bs';
import { MdOutlineList, MdOutlineAnalytics, MdOutlineBlock } from 'react-icons/md';
import { FaUserPlus, FaUserSlash } from 'react-icons/fa';
import Link from 'next/link';
import useToast from '@/hooks/useToast';
import { TbArrowNarrowLeft } from "react-icons/tb";
import { IoPeopleOutline } from "react-icons/io5";
import { PiAtBold } from "react-icons/pi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { useFollowUser } from '@/hooks/useFollowUser';
// current who can reply option
import { FiCheck } from "react-icons/fi";
import { usePathname } from 'next/navigation';
import { usePinPost } from '@/hooks/usePinPost';

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
  const pathname = usePathname()

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
      {pathname !== `/${creatorUsername}` && <Link href={`/${creatorUsername}`}>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <BsPerson size={20} />
          <span>Go to @{creatorUsername}'s profile</span>
        </div>
      </Link>}
    </>
  );
};

// ------------ Menú para usuarios autenticados (cuando el usuario es el creador del post) ------------
const DeleteItemOption = ({ type, postId, userId, setMenuOpen }: { type: 'normal' | 'quote', postId: string; userId: string, setMenuOpen: (open: boolean) => void }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const handleDeletePost = async () => {
    setMenuOpen(false);
    showToast(type == 'normal' ? "Deleting post..." : "Unquoting post...");

    let resMessage = "";

    if (type === 'normal') {
      resMessage = await deleteNormalPost(postId);
    } else if (type === 'quote') {
      resMessage = await deleteQuotePost(postId);
    }

    showToast(resMessage);

    queryClient.invalidateQueries(['posts']);
    queryClient.invalidateQueries(['creatorDataHoverCard', userId]);
    queryClient.invalidateQueries(['userProfile', userId]);
    queryClient.invalidateQueries(['userPosts', userId], { refetchActive: true, refetchInactive: true });
  };

  return (
    <li className="itemClass itemHover" onClick={handleDeletePost}>
      <HiOutlineTrash size={20} color='#ef4444' />
      <span className='text-red-500'>
        {type === 'normal' ? "Delete post" : "Remove quote"}
      </span>
    </li>
  );
};

export default DeleteItemOption;


const ChangeWhoCanReplyOption = ({ postId, setDropdownContent }: { postId: string, setDropdownContent: React.Dispatch<React.SetStateAction<"" | "whoCanReply">> }) => {
  return (
    <>
      <div className="itemClass" onClick={() => { setDropdownContent('whoCanReply') }}>
        <HiOutlineUsers size={20} />
        <span>Change who can reply</span>
      </div>
    </>
  )
}
// 

const PinPostOption = ({
  creatorUsername,
  postId,
  isPinned: initialIsPinned,
  setInitialPinnedState,
  setMenuOpen,
}: {
  creatorUsername: string;
  postId: string;
  isPinned: boolean;
  setInitialPinnedState: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen: (open: boolean) => void;
}) => {
  const mutation = usePinPost(creatorUsername, postId, initialIsPinned);

  const handlePinToggle = async () => {
    const updatedPinState = !initialIsPinned;
    setInitialPinnedState(updatedPinState);
    setMenuOpen(false);
    mutation.mutate();
  };

  return (
    <div className="itemClass" onClick={handlePinToggle}>
      {initialIsPinned ? <BsPinAngleFill size={20} /> : <BsPinAngle size={20} />}
      <span>{initialIsPinned ? "Unpin from your profile" : "Pin to your profile"}</span>
    </div>
  );
};

export const OwnerPostMenu = ({
  type,
  creatorUsername,
  postId,
  userId,
  states,
  setMenuOpen,
}: {
  type:  'normal' | 'quote', // post type ('normal' or 'quote', to handle deletion)
  creatorUsername: string;
  postId: string;
  userId: string;
  states?: {
    isPinned?: boolean;
    setInitialPinnedState?: React.Dispatch<React.SetStateAction<boolean>>;
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
        <DeleteItemOption
          type={type}
          postId={postId}
          userId={userId}
          setMenuOpen={setMenuOpen}
        />
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <HiPencil size={20} />
          <span>Edit post</span>
        </div>
        <PinPostOption
          creatorUsername={creatorUsername}
          postId={postId}
          isPinned={states?.isPinned!}
          setInitialPinnedState={states?.setInitialPinnedState!}
          setMenuOpen={setMenuOpen}
        />
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <MdOutlineAnalytics size={20} />
          <span>View post analytics</span>
        </div>
        <div className="itemClass" onClick={() => setMenuOpen(false)}>
          <BsLink45Deg size={20} />
          <span>Embed post</span>
        </div>
        {/* who can reply item */}
        <ChangeWhoCanReplyOption postId={postId} setDropdownContent={setDropdownContent} />
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
// En el componente FollowUserOption
export const FollowUserOption = ({
  userId,
  creatorUsername,
  isFollowing: initialIsFollowing,
  setInitialFollowState,
  setMenuOpen,
}: {
  userId: string;
  creatorUsername: string;
  isFollowing: boolean;
  setInitialFollowState: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen: (open: boolean) => void;
}) => {
  const mutation = useFollowUser(userId, initialIsFollowing);

  const { showToast } = useToast()

  const handleFollowToggle = async () => {
    const updatedFollowing = !initialIsFollowing;
    setInitialFollowState(updatedFollowing);
    showToast(updatedFollowing ? `Followed @${creatorUsername}` : `Unfollowed @${creatorUsername}`)
    mutation.mutate();
  };

  return (
    <div className="itemClass" onClick={handleFollowToggle}>
      {initialIsFollowing ? <FaUserSlash size={20} /> : <FaUserPlus size={20} />}
      <span>{initialIsFollowing ? `Unfollow @${creatorUsername}` : `Follow @${creatorUsername}`}</span>
    </div>
  );
};

// En el componente OtherUserPostMenu
export const OtherUserPostMenu = ({
  userId,
  postId,
  creatorUsername,
  states,
  setMenuOpen,
}: {
  userId: string;
  postId: string;
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