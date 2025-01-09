"use client"

import React, { cloneElement, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  buttonTrigger: React.ReactElement<any, any>;
  children: React.ReactNode;
  width?: number; // pizels
  isOpen?: boolean;
  onClose?: () => void; // Prop opcional
  closeOnDarkClick: boolean;
}

const Modal = ({ buttonTrigger, children, width, isOpen, onClose, closeOnDarkClick = true }: ModalProps) => {
  const [modal, setModal] = useState<boolean>(isOpen ?? false);
  const [animation, setAnimation] = useState<boolean>(false);
  const ModalRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isScreenHeightLarge, setIsScreenHeightLarge] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    setIsScreenHeightLarge(window.innerHeight > 400);
  }, []);

  useEffect(() => {
    if (modal) {
      setAnimation(true);
    } else {
      setAnimation(false);
    }
  }, [modal]);

  useEffect(() => {
    if (!animation) {
      setTimeout(() => {
        setModal(false);
        onClose?.(); // Llama a `onClose` si está disponible
      }, 200);
    }
  }, [animation, onClose]);

  useEffect(() => {
    const handler1 = (e: KeyboardEvent) => {
      if (modal && e.code === 'Escape') {
        setAnimation(false);
        onClose?.(); // Cierra el modal y llama a `onClose` si está disponible
      }
    };

    const handler2 = (e: MouseEvent) => {
      if (modal && ModalRef.current) {
        if (!ModalRef.current.contains(e.target as Node)) {
          // Solo cierra el modal si `closeOnDarkClick` es verdadero
          if (closeOnDarkClick) {
            setAnimation(false);
            onClose?.();  // Llama a `onClose` si está disponible
          }
        }
      }
    };

    document.addEventListener('keyup', handler1);
    document.addEventListener('mousedown', handler2);

    return () => {
      document.removeEventListener('keyup', handler1);
      document.removeEventListener('mousedown', handler2);
    };
  }, [modal, closeOnDarkClick]);

  const modalWidth: number = width ? width : 384;

  return (
    <>
      {cloneElement(buttonTrigger, { onClick: () => setModal(!modal) })}

      {modal && ReactDOM.createPortal(
        <div
          className={`
            ${animation ? 'opacity-1' : 'opacity-0'}
            fixed top-0 left-0 flex justify-center py-5 overflow-y-auto
            ${isScreenHeightLarge ? 'items-center' : 'items-start'}
            w-full h-dvh dark:bg-neutral-900/60 bg-neutral-800/60 z-50 duration-300
            modalShadowBackground
          `}
        >
          <div
            ref={ModalRef}
            style={{ maxWidth: `${modalWidth}px` }}
            className={`
              ${animation ? 'scale-100' : 'scale-[.96]'}
              h-auto max-h-[600px] overflow-y-auto w-[90%] shadow-lg rounded-md overflow-hidden duration-100 select-none
            `}
          >
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Modal;