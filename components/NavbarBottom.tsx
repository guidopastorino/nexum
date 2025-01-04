"use client"
import React, { useState, useEffect } from 'react'
// 
import { MdHome, MdOutlineHome, MdChecklistRtl, MdOutlinePrivacyTip, MdPrivacyTip, MdPersonOutline } from "react-icons/md";
import { BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import { usePathname } from 'next/navigation';
import { BiSolidHomeCircle, BiHomeCircle } from "react-icons/bi";
import { MdEmail, MdOutlineEmail, MdPeople, MdOutlinePersonOutline, MdPerson, MdPeopleOutline } from "react-icons/md";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { BsFillBellFill, BsBell } from "react-icons/bs";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { RiFileListLine, RiFileListFill } from 'react-icons/ri'
import { RiFileList3Line, RiFileList3Fill } from "react-icons/ri";
import useUser from '@/hooks/useUser';
import { PiGear, PiGearFill } from 'react-icons/pi';
import AuthModal from './modal/AuthModal';
import { IoMdLogIn } from "react-icons/io";
import { NavigationLinkProps } from '@/types/types';
import CreatePostFixedButton from './CreatePostFixedButton';

const NavbarBottom = () => {
  const user = useUser()

  const { data: session, status } = useSession()

  const pathname = usePathname()

  const navLinks: NavigationLinkProps[] = [
    { icon: <BiHomeCircle />, activeIcon: <BiSolidHomeCircle />, title: "Home", route: "/" },
    { icon: <RiFileListLine />, activeIcon: <RiFileListFill />, title: "Feeds", route: "/feeds" },
    { icon: <IoSearchOutline />, activeIcon: <IoSearch />, title: "Explore", route: "/explore" },
    { icon: <BsBell />, activeIcon: <BsFillBellFill />, title: "Notifications", route: "/notifications" },
    { icon: <MdOutlinePersonOutline />, activeIcon: <MdPerson />, title: "Profile", route: `/${user.username}` },
  ];

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
    <div className={`flex md:hidden flex-col z-40 sticky bottom-0 ${isHidden ? 'opacity-45 pointer-events-none' : 'opacity-100 pointer-events-auto'} duration-300`}>
      <div className="w-full flex justify-end items-center p-4">
        <CreatePostFixedButton />
      </div>
      {/*  */}
      <nav className={"h-14 bg-white dark:bg-neutral-900 w-full border-t dark:border-neutral-600"}>
        <ul className={`flex justify-evenly items-center gap-3 text-[26px] h-full`}>

          {
            navLinks
              .filter(link =>
                // Si el usuario no está logueado, renderiza solo "Feed", "Explore" y "Communities"
                session?.user ? true : (link.route === '/' || link.route === '/explore' || link.route === '/feeds' || link.route === '/communities')
              )
              .map((el: NavigationLinkProps, i: number) => (
                <NavbarBottomLink key={i} {...el} />
              ))
          }

          {/* Login or Signin button */}
          {status === 'unauthenticated' && <AuthModal
            buttonTrigger={
              <li className='h-full' title={"Login or Signin"}>
                <div className="text-black dark:text-white flex justify-center items-center h-full w-full shrink-0">
                  <IoMdLogIn />
                </div>
              </li>
            }
          />}
        </ul>
      </nav>
    </div>
  )
}

export default NavbarBottom

const NavbarBottomLink: React.FC<NavigationLinkProps> = ({ icon, activeIcon, route, title }) => {
  const pathname = usePathname()

  return (
    <li className='h-full' title={title}>
      <Link href={route} className="text-black dark:text-white flex justify-center items-center h-full w-full shrink-0">
        {pathname == route ? activeIcon : icon}
      </Link>
    </li>
  )
}