import Modal from '@/components/modal/Modal';
import ky from 'ky';
import React from 'react'
import { HiPencil } from 'react-icons/hi2';

type QuoteButtonProps = {
  postId: string;
  setMenuOpen: (open: boolean) => void;
}

const QuoteButton: React.FC<QuoteButtonProps> = ({ postId, setMenuOpen }) => {
  const quotePost = async () => {
    try {
      await ky.post("/api/posts", {
        json: {
          content: 'This is a test',
          quotedPost: postId,
          type: 'quote'
        }
      }).json()
      alert("Quoted")
    } catch (error) {
      console.log(error)
    }

    setMenuOpen(false)
  }

  return (
    <div
      onClick={() => quotePost()}
      className="itemClass itemHover"
    >
      <HiPencil size={20} />
      <span>Quote</span>
    </div>
  )
}

export default QuoteButton