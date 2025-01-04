import Modal from '@/components/modal/Modal';
import React from 'react'
import { HiPencil } from 'react-icons/hi2';

type QuoteButtonProps = {
  setMenuOpen: (open: boolean) => void;
}

const QuoteButton: React.FC<QuoteButtonProps> = ({ setMenuOpen }) => {
  return (
    <Modal width={500} buttonTrigger={<div
      onClick={() => setMenuOpen(false)}
      className="itemClass itemHover"
    >
      <HiPencil size={20} />
      <span>Quote</span>
    </div>}>
      <div className="bg-white dark:bg-neutral-800 pt-2">
        Quote post
      </div>
    </Modal>
  )
}

export default QuoteButton