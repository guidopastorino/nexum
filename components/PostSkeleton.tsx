import React from 'react'

const PostSkeleton = () => {
  return (
    <div className="flex justify-center items-start gap-2 w-full max-w-xl mx-auto p-3 mb-2">
      {/* creator profile image */}
      <div className='self-start shrink-0'>
        <div className='rounded-full bg-gray-300 dark:bg-neutral-600 w-10 h-10 animate-pulse'></div>
      </div>
      {/* post content */}
      <div className='flex justify-start items-stretch gap-2 flex-col w-full flex-1'>
        {/* creator info and post date + options btn */}
        <div className='flex justify-between items-center gap-2'>
          <div className='flex justify-center items-center gap-1'>
            <div className='rounded-full bg-gray-300 dark:bg-neutral-600 w-16 h-2 animate-pulse'></div>
            <div className='rounded-full bg-gray-300 dark:bg-neutral-600 w-16 h-2 animate-pulse'></div>
          </div>
        </div>
        {/* content and media */}
        <div className='rounded-md bg-gray-300 dark:bg-neutral-600 w-full h-2 animate-pulse'></div>
        <div className='rounded-md bg-gray-300 dark:bg-neutral-600 w-full h-2 animate-pulse'></div>
        <div className='rounded-md bg-gray-300 dark:bg-neutral-600 w-full h-32 animate-pulse'></div>
        {/* estadisticas del post normal */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex justify-center items-center gap-2">
            {/* like */}
            <div className='rounded-full bg-gray-300 dark:bg-neutral-600 w-6 h-6 animate-pulse'></div>
            {/* comment */}
            <div className='rounded-full bg-gray-300 dark:bg-neutral-600 w-6 h-6 animate-pulse'></div>
            {/* repost & quote */}
            <div className='rounded-full bg-gray-300 dark:bg-neutral-600 w-6 h-6 animate-pulse'></div>
          </div>
          <div className="flex justify-center items-center gap-2">
            {/* bookmark */}
            <div className='rounded-full bg-gray-300 dark:bg-neutral-600 w-6 h-6 animate-pulse'></div>
            {/* save */}
            <div className='rounded-full bg-gray-300 dark:bg-neutral-600 w-6 h-6 animate-pulse'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton;