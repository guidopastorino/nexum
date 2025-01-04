import React from 'react'

const FetchErrorRetryButton = () => {
  return (
    <div className='flex flex-col w-full p-3 justify-center items-center'>
      <p className="p-5 opacity-70 text-center text-gray-500">
        Oops. Something went wrong!
      </p>
      <div onClick={() => window.location.reload()} className="rounded-full text-white px-4 py-2 bg-orange-600 hover:bg-orange-700 active:brightness-90 duration-200 cursor-pointer">
        Retry
      </div>
    </div>
  )
}

export default FetchErrorRetryButton