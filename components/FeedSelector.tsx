"use client"
import React, { useState, useEffect } from 'react'
import HamburgerMenu from './HamburgerMenu';
import Link from 'next/link';
import { HiOutlineHashtag } from 'react-icons/hi2';
import { useSession } from 'next-auth/react';
import { useRouter } from 'nextjs-toploader/app';
import Logo from './Logo';

const FeedSelector = () => {
  const { data: session } = useSession();

  const [translateY, setTranslateY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const maxOffset = 64;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;

    setTranslateY((prev) => {
      const newTranslateY = prev - deltaY;
      return Math.max(Math.min(newTranslateY, 0), -maxOffset);
    });

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const router = useRouter();

  return (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-sm dark:bg-neutral-900/70 bg-white/70 duration-200 border-b borderColor"
      style={{ transform: `translateY(${translateY}px)` }} // Aplica el desplazamiento dinámico
    >
      <div className="flex flex-col">
        <div className='flex justify-between items-center gap-3 p-2'>
          <div className="w-10 h-10">
            {session && <HamburgerMenu />}
          </div>
          <Link href="/">
            <Logo size={30} />
          </Link>
          <button onClick={() => router.push("/feeds")} className='w-12 h-12 flex justify-center items-center hover:bg-gray-200/45 dark:hover:bg-neutral-700/15 active:bg-gray-200/70 dark:active:bg-neutral-600/30'>
            <HiOutlineHashtag size={22} />
          </button>
        </div>
        <div className='grid grid-cols-2'>
          <div className="flex justify-center items-center p-3 cursor-pointer duration-200 hover:bg-gray-200/45 dark:hover:bg-neutral-700/15 active:bg-gray-200/70 dark:active:bg-neutral-600/30">
            For you
          </div>
          <div className="flex justify-center items-center p-3 cursor-pointer duration-200 hover:bg-gray-200/45 dark:hover:bg-neutral-700/15 active:bg-gray-200/70 dark:active:bg-neutral-600/30">
            Following
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FeedSelector;