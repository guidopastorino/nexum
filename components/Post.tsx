import React from 'react'
import Modal from './modal/Modal'

const Post = () => {
  return (
    <Modal buttonTrigger={<button>button</button>}>
      <div className='flex flex-col justify-center items-center gap-5 rounded-lg p-10 bg-white dark:bg-neutral-800'>Hola</div>
    </Modal>
  )
}

export default Post