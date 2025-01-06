"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
// icons
import { BiSolidHomeCircle, BiHomeCircle } from "react-icons/bi";
import { MdEmail, MdOutlineEmail, MdPeople, MdOutlinePersonOutline, MdPerson, MdPeopleOutline } from "react-icons/md";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { BsFillBellFill, BsBell, BsPencilSquare } from "react-icons/bs";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { RiFileListLine, RiFileListFill } from "react-icons/ri"
import { RiFileList3Line, RiFileList3Fill } from "react-icons/ri";
import useUser from '@/hooks/useUser';
import { PiGear, PiGearFill } from 'react-icons/pi';
import AuthModal from './modal/AuthModal';
import { IoMdLogIn } from "react-icons/io";
import { NavigationLinkProps } from '@/types/types';
import CreatePostFixedButton from './CreatePostFixedButton';
import Logo from './Logo';

const AsideLeft = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const user = useUser();

  const navLinks: NavigationLinkProps[] = [
    { icon: <BiHomeCircle />, activeIcon: <BiSolidHomeCircle />, title: "Home", route: "/" },
    { icon: <IoSearchOutline />, activeIcon: <IoSearch />, title: "Explore", route: "/explore" },
    { icon: <RiFileListLine />, activeIcon: <RiFileListFill />, title: "Feeds", route: "/feeds" },
    { icon: <BsBell />, activeIcon: <BsFillBellFill />, title: "Notifications", route: "/notifications" },
    { icon: <MdPeopleOutline />, activeIcon: <MdPeople />, title: "Communities", route: "/communities" },
    { icon: <GoBookmark />, activeIcon: <GoBookmarkFill />, title: "Bookmarks", route: "/bookmarks" },
    { icon: <RiFileList3Line />, activeIcon: <RiFileList3Fill />, title: "Lists", route: "/lists" },
    { icon: <MdOutlineEmail />, activeIcon: <MdEmail />, title: "Messages", route: "/messages" },
    { icon: <MdOutlinePersonOutline />, activeIcon: <MdPerson />, title: "Profile", route: `/${user.username}` },
    { icon: <PiGear />, activeIcon: <PiGearFill />, title: "Settings", route: `/settings` },
  ];

  if (status === "loading") {
    return (
      <div className='hidden md:block w-full top-0 sticky overflow-y-auto py-3 h-dvh'>
        {Array.from({ length: navLinks.length }).map((_, i) => (
          <div key={i} className='h-12 rounded-md mb-2 bg-gray-300/60 dark:bg-neutral-700/60 w-full block p-3 animate-pulse'></div>
        ))}
      </div>
    );
  }

  return (
    <div className='hidden md:flex flex-col gap-7 justify-between items-stretch w-full top-0 sticky overflow-y-auto px-2 py-3 h-dvh'>
      <ul>
        <li>
          <Link href={"/"} className="w-16 h-16 flex justify-center items-center rounded-full itemHover p-3 mb-3">
            <Logo size={25} />
          </Link>
        </li>
        {navLinks
          .filter(link =>
            // Si el usuario no está logueado, renderiza solo "Feed", "Explore" y "Communities"
            session?.user ? true : (link.route === '/' || link.route === '/explore' || link.route === '/feeds' || link.route === '/communities')
          )
          .map((el: NavigationLinkProps, i: number) => (
            <li key={i} className='list-none mb-2'>
              <Link href={el.route} className={`${el.route === pathname ? "bg-gray-200 dark:bg-neutral-800/70" : ""} flex justify-start items-center gap-3 px-5 py-2 itemHover rounded-full`}>
                <div className='w-6 h-6 overflow-hidden shrink-0 flex justify-center items-center'>
                  {el.route === pathname
                    ? React.cloneElement(el.activeIcon as React.ReactElement, { className: 'w-full h-full' })
                    : React.cloneElement(el.icon as React.ReactElement, { className: 'w-full h-full' })
                  }
                </div>
                <span className='text-sm'>{el.title}</span>
              </Link>
            </li>
          ))}
        {status === 'unauthenticated' && <AuthModal
          buttonTrigger={
            <li className="flex justify-start items-center gap-3 px-5 py-2 itemHover rounded-full list-none mb-2">
              <div className='w-6 h-6 overflow-hidden shrink-0 flex justify-center items-center'>
                <IoMdLogIn className='w-full h-full' />
              </div>
              <span className='text-sm'>Login or Signin</span>
            </li>
          }
        />}
        <CreatePostFixedButton trigger={
          <li className="mt-5 cursor-pointer flex justify-start items-center gap-3 px-5 py-2 rounded-full text-white shadow-lg bg-orange-700 hover:brightness-75 duration-200">
            <div className='w-6 h-6 overflow-hidden shrink-0 flex justify-center items-center'>
              <BsPencilSquare className='w-[95%] h-[95%]' />
            </div>
            <span className='text-sm'>Create new post</span>
          </li>
        } />
      </ul>

      <div>
        <span className='text-sm text-center block dark:text-neutral-600 text-gray-400 break-words'>
          &copy; {new Date().getFullYear()} Nexum Social. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default AsideLeft;