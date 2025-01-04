'use client'
import React, { useEffect, useRef, useState } from 'react'
import { CgMenuRightAlt } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import ReactDom from 'react-dom'
// 
import { RiHome2Line, RiHome2Fill } from "react-icons/ri";
import { PiTelevisionSimpleBold, PiTelevisionSimple } from "react-icons/pi";
import { BiMoviePlay, BiSolidMoviePlay } from "react-icons/bi";
import { FaFire } from "react-icons/fa";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidHomeCircle, BiHomeCircle } from "react-icons/bi";
import { MdEmail, MdOutlineEmail, MdPeople, MdOutlinePersonOutline, MdPerson, MdPeopleOutline } from "react-icons/md";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { BsFillBellFill, BsBell } from "react-icons/bs";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { useSession } from 'next-auth/react';
import { RiFileListLine, RiFileListFill } from 'react-icons/ri'
import { RiFileList3Line, RiFileList3Fill } from "react-icons/ri";
import useUser from '@/hooks/useUser';
import { PiGear, PiGearFill } from 'react-icons/pi';
import AuthModal from './modal/AuthModal';
import { IoMdLogIn } from "react-icons/io";
import { NavigationLinkProps } from '@/types/types';


type Props = {}

const HamburgerMenu = (props: Props) => {
  const user = useUser()

  const [menu, setMenu] = useState<boolean>(false)
  const [animation, setAnimation] = useState<boolean>(false)
  const MenuRef = useRef<HTMLDivElement | null>(null);

  const { data: session, status } = useSession();
  const pathname = usePathname();

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

  useEffect(() => {
    if (menu) {
      setAnimation(true)
    } else {
      setAnimation(false)
    }
  }, [menu])

  useEffect(() => {
    const wrapper = document.getElementById("content-wrapper")
    if (wrapper) {
      if (menu) {
        wrapper.classList.add('brightness-[.4]')
        wrapper.classList.add('pointer-events-none')
      } else {
        wrapper.classList.remove('brightness-[.4]')
        wrapper.classList.remove('pointer-events-none')
      }
    }
  }, [menu])


  useEffect(() => {
    if (!animation) {
      setTimeout(() => {
        setMenu(false)
      }, 200);
    }
  }, [animation])


  // to close the menu when clicking outside
  useEffect(() => {
    let handler = (e: MouseEvent) => {
      if (menu && MenuRef.current) {
        if (!MenuRef.current.contains(e.target as Node)) {
          setAnimation(false)
        }
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  })

  return (
    <>
      {/* <button onClick={() => {
        setMenu(true)
      }} className="text-white text-4xl rounded-md active:brightness-75">
        <CgMenuRightAlt />
      </button> */}

      <button onClick={() => setMenu(true)} className="w-10 h-10 rounded-full border borderColor overflow-hidden">
        <img src={user?.profileImage!} alt="profile image" className="w-full h-full object-cover" />
      </button>

      {menu && ReactDom.createPortal(
        <div ref={MenuRef} className={`${animation ? 'left-0' : 'left-[-100%]'} w-[70%] max-w-96 duration-300 fixed z-50 top-0 h-[100dvh] bg-neutral-900 overflow-x-hidden overflow-y-auto p-3`}>
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
        </div>,
        document.body
      )}
    </>
  )
}

export default HamburgerMenu