import React, { useState } from 'react';
import { HiOutlineBookmark, HiBookmark } from 'react-icons/hi2';
import { useSession } from 'next-auth/react';
import ky from 'ky';
import AuthModal from '@/components/modal/AuthModal';

type BookmarkButtonProps = {
  initialBookmarkState: boolean;
  setInitialBookmarkState: React.Dispatch<React.SetStateAction<boolean>>;
  bookmarksCount: number;
  postId: string;
};

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  initialBookmarkState,
  setInitialBookmarkState,
  bookmarksCount,
  postId,
}) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarkState);
  const [bookmarksCountState, setBookmarksCount] = useState(bookmarksCount);
  const { data: session } = useSession();

  const handleBookmark = async () => {
    if (!session) {
      alert('You must be logged in to bookmark posts');
      return;
    }

    try {
      // Actualización optimista
      setBookmarked(true);
      setBookmarksCount(bookmarksCountState + 1);
      setInitialBookmarkState(true);

      // Llamada a la API para agregar el bookmark
      await ky.post(`/api/posts/${postId}/bookmark`).json();
    } catch (error) {
      console.error(error);
      // Revertir en caso de error
      setBookmarked(false);
      setBookmarksCount(bookmarksCountState - 1);
      setInitialBookmarkState(false);
    }
  };

  const handleUnbookmark = async () => {
    if (!session) {
      alert('You must be logged in to unbookmark posts');
      return;
    }

    try {
      // Actualización optimista
      setBookmarked(false);
      setBookmarksCount(bookmarksCountState - 1);
      setInitialBookmarkState(false);

      // Llamada a la API para quitar el bookmark
      await ky.post(`/api/posts/${postId}/unbookmark`).json();
    } catch (error) {
      console.error(error);
      // Revertir en caso de error
      setBookmarked(true);
      setBookmarksCount(bookmarksCountState + 1);
      setInitialBookmarkState(true);
    }
  };

  // Si no hay sesión, mostrar el modal de autenticación
  if (!session) {
    return (
      <div className="flex justify-center items-center gap-1">
        <AuthModal
          buttonTrigger={
            <button
              onClick={bookmarked ? handleUnbookmark : handleBookmark}
              className="postButton"
            >
              {bookmarked ? <HiBookmark color="blue" /> : <HiOutlineBookmark />}
            </button>
          }
        />
        <span>{bookmarksCountState}</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-1">
      <button
        onClick={bookmarked ? handleUnbookmark : handleBookmark}
        className="postButton"
      >
        {bookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
      </button>
      <span>{bookmarksCountState}</span>
    </div>
  );
};

export default BookmarkButton;