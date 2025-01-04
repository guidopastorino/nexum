"use client"
import React, { useState, useEffect } from 'react'

const FeedSelector = () => {
  // Scroll events
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // El usuario está desplazándose hacia abajo, ocultar
      setIsHidden(true);
    } else {
      // El usuario está desplazándose hacia arriba, mostrar
      setIsHidden(false);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`
      sticky grid grid-cols-2 h-12 w-full z-50 backdrop-blur-sm dark:bg-neutral-900/60 bg-white/60 gap-3 duration-300
      ${isHidden ? 'top-[-100%]' : 'top-0'}
    `}>
      <div className="flex justify-center items-center p-3 itemHover">
        For you
      </div>
      <div className="flex justify-center items-center p-3 itemHover">
        Following
      </div>
    </nav>
  )
}

export default FeedSelector;