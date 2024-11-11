import React from 'react'

const Message = ({ visible, message }: { visible: boolean, message: string }) => {
  return (
    <>
      {visible && <span className='block p-2 text-center w-full text-black dark:text-neutral-300'>{message}</span>}
    </>
  )
}

export default Message