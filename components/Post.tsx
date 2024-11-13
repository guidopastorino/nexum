import { PostProps } from '@/types/types';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
// icons
import { HiOutlineArrowPathRoundedSquare } from "react-icons/hi2";
import { BsPerson, BsThreeDots } from 'react-icons/bs';
import ResponsiveMenu from './ResponsiveMenu';

// Recibe los datos del post como props
const Post = ({
  _id,
  creator,
  communityId,
  feedId,
  content,
  tags,
  likes,
  repostedFrom,
  quotedPost,
  media,
  type,
  comments,
  views,
  createdAt
}: PostProps) => {
  const timeAgo = formatTimeAgo(new Date(createdAt));
  // renderiza el contenido del post normal
  const NormalPost = () => {
    return (
      <div className="flex justify-center items-start gap-2">
        {/* creator profile image */}
        <div className='self-start shrink-0'>
          <Link href={`/${creator.username}`}>
            <img
              className='w-10 h-10 object-cover overflow-hidden rounded-full'
              src={creator.profileImage}
              alt={`${creator.fullname}'s profile image`}
            />
          </Link>
        </div>
        {/* post content */}
        <div className='flex justify-start items-stretch gap-2 flex-col w-full flex-1'>
          {/* creator info and post date + options btn */}
          <div className='flex justify-between items-center gap-2'>
            <div className='flex justify-center items-center gap-1'>
              <span className='text-lg whitespace-normal truncate line-clamp-1'>{creator.fullname}</span>
              <span className='text-md opacity-50 whitespace-normal truncate line-clamp-1'>@{creator.username}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
            {/* options btn */}
            <div>
              <ResponsiveMenu
                trigger={<button className="text-gray-600 dark:text-gray-200 bg-white dark:bg-neutral-800 focus:outline-none rounded-full flex justify-center items-center hover:brightness-90 active:brightness-75 duration-100 w-8 h-8"><BsThreeDots /></button>}
                dropdownMenuOptions={{
                  width: 300, // 300px
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
            <span>{content}</span>
            {!!media?.length && media.map((media, i) => (
              <img className='w-full rounded-lg object-contain' key={i} src={media} alt='media' />
            ))}
          </div>
          {/* si es un 'quote' post, añadir contenido del post citado */}
          {type === 'quote' && quotedPost?._id && <>
            <Link href={"/post/123"} className="p-2 border rounded-lg flex justify-start items-stretch gap-2 flex-col w-full flex-1 duration-150 hover:brightness-75 dark:bg-neutral-800 bg-white dark:border-neutral-700">
              {/* creator info and post date + options btn */}
              <div className='flex justify-start items-center gap-1'>
                <img className='w-8 h-8 object-cover rounded-full overflow-hidden' src={quotedPost.creator.profileImage} alt={`${quotedPost.creator.fullname}'s profile image`} />
                <span className='text-lg whitespace-normal truncate line-clamp-1'>{quotedPost.creator.fullname}</span>
                <span className='text-md opacity-50 whitespace-normal truncate line-clamp-1'>@{quotedPost.creator.username}</span>
                <span>·</span>
                <span>{timeAgo}</span>
              </div>
              {!!quotedPost?.media && <div className='flex justify-start items-center gap-2'>
                {quotedPost?.media.map((media, i) => (
                  <img className='w-20 h-20 rounded-lg object-cover' key={i} src={media} alt='media' />
                ))}
              </div>}
              <span>{quotedPost?.content}</span>
            </Link>
          </>}
        </div>
      </div>
    )
  }

  // renderiza el contenido del post reposteado con sus datos
  const RepostedPost = () => {
    return (
      <div className="flex justify-center items-start gap-2">
        {/* creator profile image */}
        <div className='self-start shrink-0'>
          <Link href={`/${repostedFrom?.creator.username}`}>
            <img
              className='w-10 h-10 object-cover overflow-hidden rounded-full'
              src={repostedFrom?.creator.profileImage}
              alt={`${repostedFrom?.creator.fullname}'s profile image`}
            />
          </Link>
        </div>
        {/* post content */}
        <div className='flex justify-start items-stretch gap-2 flex-col w-full flex-1'>
          {/* creator info and post date + options btn */}
          <div className='flex justify-between items-center gap-2'>
            <div className='flex justify-center items-center gap-1'>
              <span className='text-lg whitespace-normal truncate line-clamp-1'>{repostedFrom?.creator.fullname}</span>
              <span className='text-md opacity-50 whitespace-normal truncate line-clamp-1'>@{repostedFrom?.creator.username}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
            {/* options btn */}
            <div>
              <ResponsiveMenu
                trigger={<button className="text-gray-600 dark:text-gray-200 bg-white dark:bg-neutral-800 focus:outline-none rounded-full flex justify-center items-center hover:brightness-90 active:brightness-75 duration-100 w-8 h-8"><BsThreeDots /></button>}
                dropdownMenuOptions={{
                  width: 300, // 300px
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
            <span>{repostedFrom?.content}</span>
            {!!repostedFrom?.media?.length && repostedFrom?.media.map((media, i) => (
              <img className='w-full rounded-lg object-contain' key={i} src={media} alt='media' />
            ))}
          </div>
          {/* si es un 'quote' post, añadir contenido del post citado */}
          {repostedFrom?.quotedPost && repostedFrom?.quotedPost?._id && <>
            <Link href={"/post/123"} className="p-2 border rounded-lg flex justify-start items-stretch gap-2 flex-col w-full flex-1 duration-150 hover:brightness-75 dark:bg-neutral-800 bg-white dark:border-neutral-700">
              {/* creator info and post date + options btn */}
              <div className='flex justify-start items-center gap-1'>
                <img className='w-8 h-8 object-cover rounded-full overflow-hidden' src={repostedFrom?.quotedPost.creator.profileImage} alt={`${repostedFrom?.quotedPost.creator.fullname}'s profile image`} />
                <span className='text-lg whitespace-normal truncate line-clamp-1'>{repostedFrom?.quotedPost.creator.fullname}</span>
                <span className='text-md opacity-50 whitespace-normal truncate line-clamp-1'>@{repostedFrom?.quotedPost.creator.username}</span>
                <span>·</span>
                <span>{timeAgo}</span>
              </div>
              {!!repostedFrom?.quotedPost?.media && <div className='flex justify-start items-center gap-2'>
                {repostedFrom?.quotedPost?.media.map((media, i) => (
                  <img className='w-20 h-20 rounded-lg object-cover' key={i} src={media} alt='media' />
                ))}
              </div>}
              <span>{repostedFrom?.quotedPost?.content}</span>
            </Link>
          </>}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-xl mx-auto bg-white dark:bg-neutral-800 border-b dark:border-neutral-700 p-2 mb-2'>
      {/* si es un repost, indicar quién lo reposteó */}
      {type === "repost" && <div className='text-black dark:text-neutral-200 flex justify-start items-center gap-2 mb-2'>
        <div className="w-10 h-10 flex justify-end items-center">
          <HiOutlineArrowPathRoundedSquare />
        </div>
        <span>Reposted by {creator.username}</span>
      </div>}

      {/* post content */}
      {type === "repost" ? <RepostedPost /> : <NormalPost />}
    </div>
  );
};

export default Post;

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}