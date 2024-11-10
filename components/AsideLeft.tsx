"use client"

import React from 'react'
import { usePathname } from 'next/navigation';
// icons
import { BiSolidHomeCircle, BiHomeCircle } from "react-icons/bi";
import { MdEmail, MdOutlineEmail, MdOutlinePeopleAlt, MdOutlinePeople, MdOutlinePersonOutline, MdPerson } from "react-icons/md";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { BsFillBellFill, BsBell } from "react-icons/bs";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import Link from 'next/link';
import useUser from '@/hooks/useUser';

type NavigationLinkProps = {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  title: string;
  route: string;
}

// navigation sidebar
const AsideLeft = () => {
  const user = useUser()

  const navLinks: NavigationLinkProps[] = [
    {
      icon: <BiHomeCircle />,
      activeIcon: <BiSolidHomeCircle />,
      title: "Feed",
      route: "/",
    },
    {
      icon: <MdOutlineEmail />,
      activeIcon: <MdEmail />,
      title: "Messages",
      route: "/messages",
    },
    {
      icon: <IoSearchOutline />,
      activeIcon: <IoSearch />,
      title: "Explore",
      route: "/explore",
    },
    {
      icon: <BsBell />,
      activeIcon: <BsFillBellFill />,
      title: "Notifications",
      route: "/notifications",
    },
    {
      icon: <GoBookmark />,
      activeIcon: <GoBookmarkFill />,
      title: "Bookmarks",
      route: "/bookmarks",
    },
    {
      icon: <MdOutlinePeopleAlt />,
      activeIcon: <MdOutlinePeople />,
      title: "Communities",
      route: "/communities"
    },
    {
      icon: <MdOutlinePersonOutline />,
      activeIcon: <MdPerson />,
      title: "Profile",
      route: `/${user.username}`
    }
  ]

  const pathname = usePathname()

  return (
    <div className='hidden md:block w-full top-12 sticky overflow-y-auto py-3' style={{ height: 'calc(100dvh - 48px)' }}>
      <ul>
        {navLinks.map((el, i) => (
          <li key={i} className='list-none'>
            <Link href={el.route} className={`${el.route == pathname ? "bg-gray-200 dark:bg-neutral-800/70" : ""} active:brightness-90 hover:bg-gray-300 dark:hover:bg-neutral-800 rounded-md duration-100 flex p-3 justify-start items-center gap-3`}>
              <div className='w-6 h-6 overflow-hidden shrink-0 flex justify-center items-center'>
                {
                  el.route == pathname
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
  )
}

export default AsideLeft