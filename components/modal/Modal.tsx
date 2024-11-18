"use client"

import React, { cloneElement, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  buttonTrigger: React.ReactElement<any, any>;
  children: React.ReactNode;
}

const Modal = ({ buttonTrigger, children }: ModalProps) => {
  const [modal, setModal] = useState<boolean>(false);
  const [animation, setAnimation] = useState<boolean>(false);
  const ModalRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isScreenHeightLarge, setIsScreenHeightLarge] = useState<boolean>(false);

  // Determina si estamos en el cliente
  useEffect(() => {
    setIsClient(true);
    setIsScreenHeightLarge(window.innerHeight > 400);
  }, []);

  // Monitorea los cambios en la altura de la pantalla
  useEffect(() => {
    if (isClient) {
      const handleResize = () => {
        setIsScreenHeightLarge(window.innerHeight > 500);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isClient]);

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
      }, 300);
    }
  }, [animation]);

  useEffect(() => {
    const handler1 = (e: KeyboardEvent) => {
      if (modal && e.code === 'Escape') {
        setAnimation(false);
      }
    };

    const handler2 = (e: MouseEvent) => {
      if (modal && ModalRef.current) {
        if (!ModalRef.current.contains(e.target as Node)) {
          setAnimation(false);
        }
      }
    };

    document.addEventListener('keyup', handler1);
    document.addEventListener('mousedown', handler2);

    return () => {
      document.removeEventListener('keyup', handler1);
      document.removeEventListener('mousedown', handler2);
    };
  });

  useEffect(() => {
    const element = document.querySelector('body');

    if (element) {
      element.classList.toggle('overflow-hidden', modal);
    }
  }, [modal]);

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
          `}
        >
          <div
            ref={ModalRef}
            className={`${animation ? 'scale-100' : 'scale-95'} h-auto max-h-[600px] overflow-y-auto w-[90%] max-w-96 shadow-lg rounded-md overflow-hidden duration-200 select-none`}
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