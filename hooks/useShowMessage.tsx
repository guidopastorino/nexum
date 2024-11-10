"use client"

import { useState, useEffect } from 'react';

export default function useShowMessage(initialMessage: string = '') {
  const [message, setMessage] = useState<string>(initialMessage);
  const [visible, setVisible] = useState<boolean>(false);

  const showMessage = (newMessage: string) => {
    setMessage(newMessage);
    setVisible(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      // Después de 3 segundos, ocultamos el mensaje
      timer = setTimeout(() => {
        setVisible(false);
        setMessage('');
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [visible]);

  return { message, visible, showMessage };
}