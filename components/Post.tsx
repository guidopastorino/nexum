import { MediaFile, PostProps } from '@/types/types';
import Link from 'next/link';
// icons
import { HiHeart, HiOutlineArrowPathRoundedSquare, HiOutlineChatBubbleOvalLeft, HiOutlineBookmark, HiPencil } from "react-icons/hi2";
import { HiUpload } from "react-icons/hi";
import { BsPerson, BsThreeDots } from 'react-icons/bs';
import ResponsiveMenu from './ResponsiveMenu';
import UserDetailsProfileCard from './UserDetailsProfileCard';
import { isImage } from '@/utils/detectFileType';

// Recibe los datos del post como props
const Post = ({
  _id,
  maskedId,
  creator,
  communityId,
  feedId,
  content,
  likes,
  repostedFrom,
  quotedPost,
  media,
  type,
  comments,
  createdAt
}: PostProps) => {
  const timeAgo = (time: Date) => formatTimeAgo(new Date(time));

  const NormalPost = () => {
    return (
      <div className="flex justify-center items-start gap-2">
        {/* creator profile image */}
        <UserDetailsProfileCard creatorId={creator._id}>
          <div className='self-start shrink-0'>
            <Link href={`/${creator.username}`}>
              <img
                className='w-10 h-10 object-cover overflow-hidden rounded-full'
                src={creator.profileImage}
                alt={`${creator.fullname}'s profile image`}
              />
            </Link>
          </div>
        </UserDetailsProfileCard>
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
                <button className="postButton">
                  <HiHeart />
                </button>
                <span>{likes.length}</span>
              </div>
              {/* comment */}
              <div className='flex justify-center items-center gap-0.5'>
                <button className="postButton">
                  <HiOutlineChatBubbleOvalLeft />
                </button>
                <span>{comments.length}</span>
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

  // renderiza el contenido del post reposteado con sus datos
  const RepostedPost = () => {
    return (
      <div className="flex justify-center items-start gap-2">
        {/* creator profile image */}
        <UserDetailsProfileCard creatorId={repostedFrom?.creator._id as string}>
          <div className='self-start shrink-0'>
            <Link href={`/${repostedFrom?.creator.username}`}>
              <img
                className='w-10 h-10 object-cover overflow-hidden rounded-full'
                src={repostedFrom?.creator.profileImage}
                alt={`${repostedFrom?.creator.fullname}'s profile image`}
              />
            </Link>
          </div>
        </UserDetailsProfileCard>
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
                trigger={<button className="text-gray-600 dark:text-gray-200 bg-white dark:bg-neutral-800 focus:outline-none rounded-full flex justify-center items-center hover:brightness-90 active:brightness-75 duration-100 w-8 h-8"><BsThreeDots /></button>}
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
            <span>{repostedFrom?.content}</span>
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
              <span>{repostedFrom?.quotedPost?.content}</span>
              {/* reposted quoted post media */}
              <MediaGallery media={repostedFrom?.quotedPost?.media ?? []} />
            </Link>
          </>}
          {/* estadisticas del post reposteado (el original) */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              {/* like */}
              <div className='flex justify-center items-center gap-0.5'>
                <button className="postButton">
                  <HiHeart />
                </button>
                <span>{repostedFrom?.likes.length}</span>
              </div>
              {/* comment */}
              <div className='flex justify-center items-center gap-0.5'>
                <button className="postButton">
                  <HiOutlineChatBubbleOvalLeft />
                </button>
                <span>{repostedFrom?.comments.length}</span>
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

  return (
    <div className='w-full max-w-xl mx-auto bg-white dark:bg-neutral-800 border-b dark:border-neutral-700 p-3 mb-2'>
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

/* for now it will be string[] and images */


const MediaGallery = ({ media }: { media: MediaFile[] }) => {
  const displayMedia = media.slice(0, 4); // Solo mostramos hasta las primeras 4 imágenes
  const extraCount = media.length - 4; // Cantidad de imágenes extra

  return (
    <div
      className={`grid gap-2 ${media.length === 1
        ? 'grid-cols-1'
        : media.length === 2
          ? 'grid-cols-2'
          : media.length === 3
            ? 'grid-cols-3 grid-rows-2'
            : 'grid-cols-2'
        }`}
    >
      {displayMedia.map((file: MediaFile, i: number) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-lg ${media.length === 3
            ? i === 0
              ? 'col-span-2 row-span-2' // Primer archivo ocupa la mitad izquierda
              : 'col-span-1' // Los otros dos ocupan la mitad derecha
            : ''
            }`}
        >
          {isImage(file)
            ? <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
            : <video src={file.url} controls className="w-full h-full object-cover"></video>
          }

          {/* Mostrar el overlay "+n" en la última imagen si hay más de 4 */}
          {i === 3 && extraCount > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">
              +{extraCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};