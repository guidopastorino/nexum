"use client"
import React, { useState, useEffect } from 'react'
import HamburgerMenu from './HamburgerMenu';
import Link from 'next/link';
import { HiOutlineHashtag } from 'react-icons/hi2';

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
      sticky top-0 w-full z-50 backdrop-blur-sm dark:bg-neutral-900/70 bg-white/70 duration-300
      ${isHidden ? '-translate-y-[calc(100%-48px)]' : 'translate-y-0'}
    `}>
      <div className="flex flex-col gap-2">
        <div className='flex justify-between items-center gap-3 p-4'>
          <HamburgerMenu />

          <Link href="/">
            <img className='w-10 h-10 object-contain' src='/logo.png' alt='logo' />
          </Link>

          {/* manage pinned feeds btn */}
          <button className='w-12 h-12 flex justify-center items-center itemHover'>
            <HiOutlineHashtag size={22} />
          </button>
        </div>
        <div className='grid grid-cols-2'>
          <div className="flex justify-center items-center p-3 itemHover">
            For you
          </div>
          <div className="flex justify-center items-center p-3 itemHover">
            Following
          </div>
        </div>
      </div>
    </nav>
  )
}

export default FeedSelector;