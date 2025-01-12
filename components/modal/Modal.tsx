import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import useModal from '@/hooks/useModal';
import { closeModal } from '@/store/modal/modalSlice';

interface ModalProps {
  modalId: string;
  width?: string;
  children: React.ReactNode;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({
  modalId,
  width = '500px',
  children,
  isOpen,
}) => {
  const { handleCloseModal } = useModal('globalModal');
  const dispatch = useDispatch();
  const [animation, setAnimation] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isScreenHeightLarge, setIsScreenHeightLarge] =
    useState<boolean>(false);

  useEffect(() => {
    setIsScreenHeightLarge(window.innerHeight > 400);
  }, []);

  const handleCloseModalAux = () => {
    setAnimation(false);
    setTimeout(() => {
      handleCloseModal();
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      setAnimation(true);
    } else {
      setAnimation(false);
      setTimeout(() => dispatch(closeModal()), 200);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.code === 'Escape') {
        handleCloseModalAux();
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        handleCloseModalAux();
      }
    };

    document.addEventListener('keyup', handleEscape);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('keyup', handleEscape);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`
        ${animation ? 'opacity-1' : 'opacity-0'}
        fixed top-0 left-0 flex justify-center py-5 overflow-y-auto
        ${isScreenHeightLarge ? 'items-center' : 'items-start'}
        w-full h-dvh bg-black/50 z-50 duration-300
      `}
    >
      <div
        ref={modalRef}
        style={{ maxWidth: width }}
        className={`
          ${animation ? 'scale-100' : 'scale-[.96]'}
          relative w-[90%] shadow-lg rounded-md duration-100 h-auto max-h-[90dvh] overflow-y-auto overflow-x-hidden
        `}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;