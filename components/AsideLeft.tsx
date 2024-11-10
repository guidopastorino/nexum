"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
// icons
import { BiSolidHomeCircle, BiHomeCircle } from "react-icons/bi";
import { MdEmail, MdOutlineEmail, MdOutlinePeopleAlt, MdOutlinePeople, MdOutlinePersonOutline, MdPerson } from "react-icons/md";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { BsFillBellFill, BsBell } from "react-icons/bs";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type NavigationLinkProps = {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  title: string;
  route: string;
};

const AsideLeft = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const navLinks: NavigationLinkProps[] = [
    { icon: <BiHomeCircle />, activeIcon: <BiSolidHomeCircle />, title: "Feed", route: "/" },
    { icon: <MdOutlineEmail />, activeIcon: <MdEmail />, title: "Messages", route: "/messages" },
    { icon: <IoSearchOutline />, activeIcon: <IoSearch />, title: "Explore", route: "/explore" },
    { icon: <BsBell />, activeIcon: <BsFillBellFill />, title: "Notifications", route: "/notifications" },
    { icon: <GoBookmark />, activeIcon: <GoBookmarkFill />, title: "Bookmarks", route: "/bookmarks" },
    { icon: <MdOutlinePeopleAlt />, activeIcon: <MdOutlinePeople />, title: "Communities", route: "/communities" },
    { icon: <MdOutlinePersonOutline />, activeIcon: <MdPerson />, title: "Profile", route: `/${session?.user?.username}` },
  ];

  // Muestra los skeletons mientras la sesión está cargando
  if (status === "loading") {
    return (
      <div className='hidden md:block w-full top-12 sticky overflow-y-auto py-3' style={{ height: 'calc(100dvh - 48px)' }}>
        {Array.from({ length: navLinks.length }).map((_, i) => (
          <div key={i} className='h-12 rounded-md mb-2 bg-gray-300/60 dark:bg-neutral-700/60 w-full block p-3 animate-pulse'></div>
        ))}
      </div>
    );
  }

  return (
    <div className='hidden md:block w-full top-12 sticky overflow-y-auto py-3' style={{ height: 'calc(100dvh - 48px)' }}>
      <ul>
        {navLinks
          .filter(link =>
            // Si el usuario no está logueado, renderiza solo "Feed", "Explore" y "Communities"
            session?.user ? true : (link.route === '/' || link.route === '/explore' || link.route === '/communities')
          )
          .map((el, i) => (
            <li key={i} className='list-none'>
              <Link href={el.route} className={`${el.route === pathname ? "bg-gray-200 dark:bg-neutral-800/70" : ""} active:brightness-90 hover:bg-gray-300 dark:hover:bg-neutral-800 rounded-md duration-100 flex p-3 justify-start items-center gap-3`}>
                <div className='w-6 h-6 overflow-hidden shrink-0 flex justify-center items-center'>
                  {el.route === pathname
                    ? React.cloneElement(el.activeIcon as React.ReactElement, { className: 'w-full h-full' })
                    : React.cloneElement(el.icon as React.ReactElement, { className: 'w-full h-full' })
                  }
                </div>
                <span className='text-lg'>{el.title}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AsideLeft;
