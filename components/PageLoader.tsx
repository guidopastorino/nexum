import React from 'react'

const PageLoader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <svg viewBox="0 0 32 32" width={30} className='object-contain shrink-0 animate-rotate'>
        {/* full circle */}
        <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: '#c2410c', opacity: 0.4 }}></circle>
        {/* 1/4 circle */}
        <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: '#ea580c80', strokeDasharray: 80, strokeDashoffset: 60 }}></circle>
      </svg>
    </div>
  )
}

export default PageLoader