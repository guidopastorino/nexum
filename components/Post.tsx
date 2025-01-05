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
import { useEffect, useState } from 'react';
import LikeButton from './buttons/post/LikeButton';
import BookmarkButton from './buttons/post/BookmarkButton';
import { useSession } from 'next-auth/react';
import QuoteButton from './buttons/post/QuoteButton';
import RepostButton from './buttons/post/RepostButton';
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
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
  const [initialFollowState, setInitialFollowState] = useState<boolean>(type === 'repost' ? repostedFrom?.isFollowing! : isFollowing)
  const [initialLikeState, setInitialLikeState] = useState<boolean>(type === 'repost' ? repostedFrom?.isLiked! : isLiked)
  const [initialLikesCount, setInitialLikesCount] = useState(type === 'repost' ? repostedFrom?.likesCount! : likesCount);
  const [initialBookmarkState, setInitialBookmarkState] = useState<boolean>(type === 'repost' ? repostedFrom?.isBookmarked! : isBookmarked)
  const [initialRepostState, setInitialRepostState] = useState<boolean>(type === 'repost' ? repostedFrom?.isReposted! : isReposted)
  const [initialRepostsCount, setInitialRepostsCount] = useState(type === 'repost' ? repostedFrom?.repostsCount! : repostsCount);
  const [initialPinnedState, setInitialPinnedState] = useState<boolean>(isPinned || false)

  useEffect(() => {
    if (type == 'repost') {
      console.log(isFollowing)
    }
  }, [isFollowing])

  const handleLikeUpdate = (newLikesCount: number, newLikeState: boolean) => {
    setInitialLikesCount(newLikesCount);
    setInitialLikeState(newLikeState);
  };

  const handleRepostUpdate = (newRepostsCount: number, newRepoststate: boolean) => {
    setInitialRepostsCount(newRepostsCount);
    setInitialRepostState(newRepoststate);
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
            <Link href={`/post/${quotedPost.maskedId}`} className="p-2 border rounded-lg flex justify-start items-stretch gap-2 flex-col w-full flex-1 duration-150 hover:brightness-75 dark:bg-neutral-900 bg-white dark:border-neutral-700">
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
              <LikeButton
                initialLikeState={initialLikeState}
                initialLikesLength={initialLikesCount}
                postId={_id}
                onLikeUpdate={handleLikeUpdate}
              />
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
                  trigger={
                    <button
                      className={`${initialRepostState ? 'font-bold text-green-600' : ''} itemHover rounded-full px-2 py-1 flex justify-center items-center gap-2`}
                    >
                      <HiOutlineArrowPathRoundedSquare />
                      <span className='text-sm'>{initialRepostsCount}</span>
                    </button>
                  }
                  dropdownMenuOptions={{
                    width: 150,
                    canClickOtherElements: false,
                    positionX: 'center'
                  }}
                >
                  {(menuOpen, setMenuOpen) => (
                    <>
                      <RepostButton
                        initialRepostState={initialRepostState}
                        initialRepostsLength={initialRepostsCount}
                        postId={_id}
                        onRepostUpdate={handleRepostUpdate}
                        setMenuOpen={setMenuOpen}
                      />
                      {/* button to quote the post */}
                      <QuoteButton
                        postId={_id}
                        setMenuOpen={setMenuOpen}
                      />
                    </>
                  )}
                </ResponsiveMenu>
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
                      <GuestPostMenu creatorUsername={repostedFrom?.creator.username!} postId={repostedFrom?.maskedId!} setMenuOpen={setMenuOpen} />
                    </LoggedOut>
                    <LoggedIn>
                      <>
                        {user.username === repostedFrom?.creator.username! ? (
                          <OwnerPostMenu creatorUsername={repostedFrom?.creator.username!} userId={repostedFrom?.creator._id!} postId={repostedFrom?._id!} setMenuOpen={setMenuOpen} states={{
                            isPinned: initialPinnedState,
                            setInitialPinnedState,
                            isHighlighted,
                            isOnList,
                            isConversationMuted,
                          }} />
                        ) : (
                          <OtherUserPostMenu userId={repostedFrom?.creator._id!} creatorUsername={repostedFrom?.creator.username!} postId={repostedFrom?.maskedId!} setMenuOpen={setMenuOpen} states={{
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
            {repostedFrom?.content && <HashWords text={repostedFrom?.content} maskedId={repostedFrom?.maskedId} />}
            <MediaGallery media={repostedFrom?.media ?? []} />
          </div>
          {/* si es un 'quote' post, añadir contenido del post citado */}
          {repostedFrom?.quotedPost && repostedFrom?.quotedPost?._id && <>
            <Link href={`/post/${repostedFrom?.quotedPost.maskedId}`} className="p-2 border rounded-lg flex justify-start items-stretch gap-2 flex-col w-full flex-1 duration-150 hover:brightness-75 dark:bg-neutral-900 bg-white dark:border-neutral-700">
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
              <LikeButton
                initialLikeState={initialLikeState}
                initialLikesLength={initialLikesCount}
                postId={repostedFrom?._id!}
                onLikeUpdate={handleLikeUpdate}
              />
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
                  trigger={
                    <button
                      className={`${initialRepostState ? 'font-bold text-green-600' : ''} itemHover rounded-full px-2 py-1 flex justify-center items-center gap-2`}
                    >
                      <HiOutlineArrowPathRoundedSquare />
                      <span className='text-sm'>{initialRepostsCount}</span>
                    </button>
                  }
                  dropdownMenuOptions={{
                    width: 150,
                    canClickOtherElements: false,
                    positionX: 'center'
                  }}
                >
                  {(menuOpen, setMenuOpen) => (
                    <>
                      <RepostButton
                        initialRepostState={initialRepostState}
                        initialRepostsLength={initialRepostsCount}
                        postId={_id}
                        onRepostUpdate={handleRepostUpdate}
                        setMenuOpen={setMenuOpen}
                      />
                      {/* button to quote the post */}
                      <QuoteButton
                        postId={repostedFrom?._id!}
                        setMenuOpen={setMenuOpen}
                      />
                    </>
                  )}
                </ResponsiveMenu>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2">
              {/* bookmark */}
              <BookmarkButton
                initialBookmarkState={initialBookmarkState}
                setInitialBookmarkState={setInitialBookmarkState}
                bookmarksCount={bookmarksCount}
                postId={repostedFrom?._id!}
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

  const router = useRouter();

  const handlePostClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;

    // Si el click contiene algún elemento del post (incluyendo elementos de menú de opciones, del modal o del drawer) no redirigimos
    if (
      ['IMG', 'VIDEO', 'A', 'BUTTON', 'SPAN', 'P', 'SVG'].includes(target.tagName) ||
      target.classList.contains('itemClass') ||
      target.classList.contains('modalShadowBackground') ||
      target.classList.contains('drawerOverlay')
    ) {
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
    router.push(type === 'repost' ? `/post/${repostedFrom?.maskedId}` : `/post/${maskedId}`);
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
              {user.username === creator.username ? "you" : creator.username}
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