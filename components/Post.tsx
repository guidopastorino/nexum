import { MediaFile, PostProps } from '@/types/types';
import Link from 'next/link';
// icons
import { HiOutlineArrowPathRoundedSquare, HiOutlineChatBubbleOvalLeft, HiBookmark, HiOutlineBookmark, HiPencil } from "react-icons/hi2";
import { HiUpload } from "react-icons/hi";
import { BsPerson, BsThreeDots } from 'react-icons/bs';
import ResponsiveMenu from './ResponsiveMenu';
import UserDetailsProfileCard from './UserDetailsProfileCard';
import { isImage } from '@/utils/detectFileType';
import { RxLink2 } from "react-icons/rx";
import { BsPin } from "react-icons/bs";
import { BsPencilSquare } from 'react-icons/bs';
import HashWords from './HashWords';
import LoggedOut from './auth/LoggedOut';
import LoggedIn from './auth/LoggedIn';
import useUser from '@/hooks/useUser';
import { GuestPostMenu, OwnerPostMenu, OtherUserPostMenu } from '@/components/PostItemsComponent';
import { useState } from 'react';
import LikeButton from './buttons/post/LikeButton';
import BookmarkButton from './buttons/post/BookmarkButton';
import { useSession } from 'next-auth/react';
import QuoteButton from './buttons/post/QuoteButton';
import RepostButton from './buttons/post/RepostButton';
import { useParams, usePathname, useRouter } from 'next/navigation';
import MediaGallery from './PostMediaGallery';

// Recibe los datos del post como props
const Post = ({
  _id,
  maskedId,
  creator,
  communityId,
  feedId,
  content,
  repostedFrom,
  quotedPost,
  media,
  type,
  createdAt,
  isLiked,
  likesCount,
  commentsCount,
  bookmarksCount,
  quotesCount,
  repostsCount,
  isBookmarked,
  isReposted,
  isQuoted,
  isBlocked,
  isConversationMuted,
  isFollowing,
  isHighlighted,
  isOnList,
  isPinned,
  isUserMuted
}: PostProps) => {
  const [initialFollowState, setInitialFollowState] = useState<boolean>(isFollowing || false)
  const [initialLikeState, setInitialLikeState] = useState<boolean>(isLiked || false)
  const [initialLikesCount, setInitialLikesCount] = useState(likesCount);
  const [initialBookmarkState, setInitialBookmarkState] = useState<boolean>(isBookmarked || false)
  const [initialRepostState, setInitialRepostState] = useState<boolean>(isReposted || false)
  const [initialPinnedState, setInitialPinnedState] = useState<boolean>(isPinned || false)

  const handleLikeUpdate = (newLikesCount: number, newLikeState: boolean) => {
    setInitialLikesCount(newLikesCount);
    setInitialLikeState(newLikeState);
  };

  const timeAgo = (time: Date) => formatTimeAgo(new Date(time));

  const user = useUser()

  const pathname = usePathname()

  // solamente mostrar la marca de "Pinned" cuando estemos la ruta /[username]
  // es decir, donde se muestran los posts del usuario
  const showPinnedHero = isPinned && pathname == `/${creator.username}`

  const { data: session, status } = useSession()

  const NormalPost = () => {
    return (
      <div className="flex justify-center items-start gap-3">
        {/* creator profile image */}
        <div className='self-start shrink-0'>
          <UserDetailsProfileCard creatorId={creator._id}>
            <Link href={`/${creator.username}`}>
              <img
                className='w-10 h-10 object-cover overflow-hidden rounded-full'
                src={creator.profileImage}
                alt={`${creator.fullname}'s profile image`}
              />
            </Link>
          </UserDetailsProfileCard>
        </div>
        {/* post content */}
        <div className='flex justify-start items-stretch gap-2 flex-col w-full flex-1'>
          {/* creator info and post date + options btn */}
          <div className='flex justify-between items-center gap-2'>
            <div className='flex justify-center items-center gap-1'>
              <span className='text-lg whitespace-normal truncate line-clamp-1'>{creator.fullname}</span>
              <span className='text-md opacity-50 whitespace-normal truncate line-clamp-1'>@{creator.username}</span>
              <span>·</span>
              <span>{timeAgo(createdAt)}</span>
            </div>
            {/* options btn */}
            <div>
              <ResponsiveMenu
                trigger={
                  <button className="postButton">
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
                    <LoggedOut>
                      <GuestPostMenu creatorUsername={creator.username} postId={maskedId} setMenuOpen={setMenuOpen} />
                    </LoggedOut>
                    <LoggedIn>
                      <>
                        {user.username === creator.username ? (
                          <OwnerPostMenu creatorUsername={creator.username} userId={creator._id} postId={_id} setMenuOpen={setMenuOpen} states={{
                            isPinned: initialPinnedState,
                            setInitialPinnedState,
                            isHighlighted,
                            isOnList,
                            isConversationMuted,
                          }} />
                        ) : (
                          <OtherUserPostMenu userId={creator._id} creatorUsername={creator.username} postId={maskedId} setMenuOpen={setMenuOpen} states={{
                            isFollowing: initialFollowState,
                            setInitialFollowState,
                            isOnList,
                            isUserMuted,
                            isBlocked,
                          }} />
                        )}
                      </>
                    </LoggedIn>
                  </>
                )}
              </ResponsiveMenu>
            </div>
          </div>
          {/* content and media */}
          <div>
            {content && <HashWords text={content} maskedId={maskedId} />}
            <MediaGallery media={media ?? []} />
          </div>
          {/* si es un 'quote' post, añadir contenido del post citado */}
          {type === 'quote' && quotedPost?._id && <>
            <Link href={`/post/${quotedPost.maskedId}`} className="p-2 border rounded-lg flex justify-start items-stretch gap-2 flex-col w-full flex-1 duration-150 hover:brightness-75 dark:bg-neutral-800 bg-white dark:border-neutral-700">
              {/* creator info and post date + options btn */}
              <div className='flex justify-start items-center gap-1'>
                <img className='w-8 h-8 object-cover rounded-full overflow-hidden' src={quotedPost.creator.profileImage} alt={`${quotedPost.creator.fullname}'s profile image`} />
                <span className='text-lg whitespace-normal truncate line-clamp-1'>{quotedPost.creator.fullname}</span>
                <span className='text-md opacity-50 whitespace-normal truncate line-clamp-1'>@{quotedPost.creator.username}</span>
                <span>·</span>
                <span>{timeAgo(quotedPost.createdAt)}</span>
              </div>
              <span>{quotedPost?.content}</span>
              <MediaGallery media={quotedPost?.media ?? []} />
            </Link>
          </>}
          {/* estadisticas del post normal */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              {/* like */}
              <div className='flex justify-center items-center gap-0.5'>
                <LikeButton
                  initialLikeState={initialLikeState}
                  setInitialLikeState={setInitialLikeState}
                  initialLikesLength={initialLikesCount}
                  postId={_id}
                  onLikeUpdate={handleLikeUpdate}
                />
              </div>
              {/* comment */}
              <div className='flex justify-center items-center gap-0.5'>
                <button className="postButton">
                  <HiOutlineChatBubbleOvalLeft />
                </button>
                <span>{commentsCount}</span>
              </div>
              {/* repost & quote */}
              <div className='flex justify-center items-center gap-0.5'>
                <ResponsiveMenu
                  trigger={<button className='postButton'><HiOutlineArrowPathRoundedSquare /></button>}
                  dropdownMenuOptions={{
                    width: 150,
                    canClickOtherElements: false
                  }}
                >
                  {(menuOpen, setMenuOpen) => (
                    <>
                      <RepostButton
                        initialRepostState={initialRepostState}
                        setInitialRepostState={setInitialRepostState}
                        repostsCount={repostsCount}
                        postId={_id}
                        setMenuOpen={setMenuOpen}
                      />
                      {/* button to quote the post */}
                      <QuoteButton setMenuOpen={setMenuOpen} />
                    </>
                  )}
                </ResponsiveMenu>
                {repostsCount}
              </div>
            </div>
            <div className="flex justify-center items-center gap-2">
              {/* bookmark */}
              <BookmarkButton
                initialBookmarkState={initialBookmarkState}
                setInitialBookmarkState={setInitialBookmarkState}
                bookmarksCount={bookmarksCount}
                postId={_id}
              />
              {/* save */}
              <ResponsiveMenu
                trigger={<button className='postButton'><HiUpload /></button>}
                dropdownMenuOptions={{
                  width: 185,
                  canClickOtherElements: false
                }}
              >
                {(menuOpen, setMenuOpen) => (
                  <>
                    <div
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="itemClass itemHover"
                    >
                      <RxLink2 size={20} />
                      <span>Copy link</span>
                    </div>
                    {/* button to quote the post */}
                    <div
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="itemClass itemHover"
                    >
                      <HiUpload size={20} />
                      <span>Share post via …</span>
                    </div>
                    {media.length > 0 && status !== 'unauthenticated' && <div
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="itemClass itemHover"
                    >
                      <BsPencilSquare size={20} />
                      <span>Post media</span>
                    </div>}
                  </>
                )}
              </ResponsiveMenu>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // renderiza el contenido del post reposteado con sus datos
  const RepostedPost = () => {
    return (
      <div className="flex justify-center items-start gap-3">
        {/* creator profile image */}
        <div className='self-start shrink-0'>
          <UserDetailsProfileCard creatorId={repostedFrom?.creator._id as string}>
            <Link href={`/${repostedFrom?.creator.username}`}>
              <img
                className='w-10 h-10 object-cover overflow-hidden rounded-full'
                src={repostedFrom?.creator.profileImage}
                alt={`${repostedFrom?.creator.fullname}'s profile image`}
              />
            </Link>
          </UserDetailsProfileCard>
        </div>
        {/* post content */}
        <div className='flex justify-start items-stretch gap-2 flex-col w-full flex-1'>
          {/* creator info and post date + options btn */}
          <div className='flex justify-between items-center gap-2'>
            <div className='flex justify-center items-center gap-1'>
              <span className='text-lg whitespace-normal truncate line-clamp-1'>{repostedFrom?.creator.fullname}</span>
              <span className='text-md opacity-50 whitespace-normal truncate line-clamp-1'>@{repostedFrom?.creator.username}</span>
              <span>·</span>
              <span>{timeAgo(repostedFrom?.createdAt as Date)}</span> {/* */}
            </div>
            {/* options btn */}
            <div>
              <ResponsiveMenu
                trigger={<button className="postButton"><BsThreeDots /></button>}
                dropdownMenuOptions={{
                  width: 300,
                  canClickOtherElements: false
                }}
              >
                {(menuOpen, setMenuOpen) => (
                  <>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="itemClass itemHover"
                      >
                        <BsPerson size={20} />
                        <span>Lorem ipsum dolor sit.</span>
                      </div>
                    ))}
                  </>
                )}
              </ResponsiveMenu>
            </div>
          </div>
          {/* content and media */}
          <div>
            {repostedFrom?.content && <HashWords text={repostedFrom?.content} maskedId={repostedFrom?.maskedId} />}
            <MediaGallery media={repostedFrom?.media ?? []} />
          </div>
          {/* si es un 'quote' post, añadir contenido del post citado */}
          {repostedFrom?.quotedPost && repostedFrom?.quotedPost?._id && <>
            <Link href={`/post/${repostedFrom?.quotedPost.maskedId}`} className="p-2 border rounded-lg flex justify-start items-stretch gap-2 flex-col w-full flex-1 duration-150 hover:brightness-75 dark:bg-neutral-800 bg-white dark:border-neutral-700">
              {/* creator info and post date + options btn */}
              <div className='flex justify-start items-center gap-1'>
                <img className='w-8 h-8 object-cover rounded-full overflow-hidden' src={repostedFrom?.quotedPost.creator.profileImage} alt={`${repostedFrom?.quotedPost.creator.fullname}'s profile image`} />
                <span className='text-lg whitespace-normal truncate line-clamp-1'>{repostedFrom?.quotedPost.creator.fullname}</span>
                <span className='text-md opacity-50 whitespace-normal truncate line-clamp-1'>@{repostedFrom?.quotedPost.creator.username}</span>
                <span>·</span>
                <span>{timeAgo(repostedFrom?.quotedPost.createdAt)}</span>
              </div>
              {/* reposted quoted post content */}
              {repostedFrom?.quotedPost?.content && <HashWords text={repostedFrom?.quotedPost?.content} maskedId={repostedFrom?.quotedPost?.maskedId} />}
              {/* reposted quoted post media */}
              <MediaGallery media={repostedFrom?.quotedPost?.media ?? []} />
            </Link>
          </>}
          {/* estadisticas del post reposteado (el original) */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              {/* like */}
              <div className='flex justify-center items-center gap-0.5'>
                {/* post like button */}
              </div>
              {/* comment */}
              <div className='flex justify-center items-center gap-0.5'>
                <button className="postButton">
                  <HiOutlineChatBubbleOvalLeft />
                </button>
                <span>{repostedFrom?.commentsCount}</span>
              </div>
              {/* repost & quote */}
              <div className='flex justify-center items-center gap-0.5'>
                <ResponsiveMenu
                  trigger={<button className='postButton'><HiOutlineArrowPathRoundedSquare /></button>}
                  dropdownMenuOptions={{
                    width: 150,
                    canClickOtherElements: false
                  }}
                >
                  {(menuOpen, setMenuOpen) => (
                    <>
                      <div
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="itemClass itemHover"
                      >
                        <HiOutlineArrowPathRoundedSquare size={20} />
                        <span>Repost</span>
                      </div>
                      <div
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="itemClass itemHover"
                      >
                        <HiPencil size={20} />
                        <span>Quote</span>
                      </div>
                    </>
                  )}
                </ResponsiveMenu>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2">
              {/* bookmark */}
              <button className="postButton"><HiOutlineBookmark /></button>
              {/* save */}
              <button className="postButton"><HiUpload /></button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const router = useRouter();

  const handlePostClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;

    // Verifica si el elemento tiene la clase 'post'
    if (!target.classList.contains('post')) {
      e.preventDefault();
      return;
    }

    // Si hay texto seleccionado, prevenimos la navegación
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      e.preventDefault();
      return;
    }

    // Si ninguna condición se cumple, navegamos hacia la ruta
    router.push(`/post/${maskedId}`);
  };

  return (
    <div onClick={(e) => handlePostClick(e)} className='post block cursor-pointer w-full border-b border-gray-200 dark:border-neutral-700/70 p-4'>
      {/* si es un repost, indicar quién lo reposteó */}
      {type === "repost" && <div className='text-black dark:text-neutral-200 flex justify-start items-center gap-3 mb-2'>
        <div className="w-10 h-10 flex justify-end items-center">
          <HiOutlineArrowPathRoundedSquare />
        </div>
        <span>
          <span>Reposted by</span>
          <span> </span>
          <UserDetailsProfileCard creatorId={creator._id}>
            <Link className='hover:underline' href={`/${creator.username}`}>
              {creator.username}
            </Link>
          </UserDetailsProfileCard>
        </span>
      </div>}

      {showPinnedHero && <div className='text-black dark:text-neutral-200 flex justify-start items-center gap-3 mb-2'>
        <div className="w-10 h-10 flex justify-end items-center">
          <BsPin />
        </div>
        <span>Pinned</span>
      </div>}

      {/* post content */}
      {type === "repost" ? <RepostedPost /> : <NormalPost />}
    </div>
  );
};

export default Post;

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 3) return "now"
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}m`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}