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
import useUser from '@/hooks/useUser';


type Props = {}

const HamburgerMenu = (props: Props) => {
  const user = useUser()

  const [menu, setMenu] = useState<boolean>(false)
  const [animation, setAnimation] = useState<boolean>(false)
  const MenuRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname()

  const navLinks = [
    {
      name: "Home",
      route: "/",
      icon: <RiHome2Line />,
      activeIcon: <RiHome2Fill />
    },
    {
      name: "TV Shows",
      route: "/tv-shows",
      icon: <PiTelevisionSimple />,
      activeIcon: <PiTelevisionSimpleBold />
    },
    {
      name: "Movies",
      route: "/movies",
      icon: <BiMoviePlay />,
      activeIcon: <BiSolidMoviePlay />
    }
  ]

  useEffect(() => {
    if (menu) {
      setAnimation(true)
    } else {
      setAnimation(false)
    }
  }, [menu])

  useEffect(() => {
    const wrapper = document.getElementById("content-wrapper")
    if(wrapper){
      if(menu){
        wrapper.classList.add('brightness-[.4]')
      } else {
        wrapper.classList.remove('brightness-[.4]')
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
        <div ref={MenuRef} className={`${animation ? 'left-0' : 'left-[-100%]'} w-[80%] max-w-96 duration-300 fixed z-50 top-0 h-[100dvh] bg-neutral-900 overflow-x-hidden overflow-y-auto`}>
          <div className='flex justify-between items-center gap-3 text-white font-medium p-3'>
            <span className='text-xl'>Menu</span>
            <button onClick={() => setAnimation(false)} className='text-3xl'>
              <RxCross2 />
            </button>
          </div>
          <ul className='w-full'>
            {navLinks.map((el, i) => (
              <li className='w-full' key={i}>
                <Link onClick={() => setAnimation(false)} className='hover:bg-neutral-700 active:bg-neutral-800 w-full p-3 flex justify-start items-center gap-3' href={el.route}>
                  <div className='text-2xl'>
                    {
                      el.activeIcon
                        ? <>{el.route == pathname ? el.activeIcon : el.icon}</>
                        : el.icon
                    }
                  </div>
                  <span className='text-md'>{el.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </>
  )
}

export default HamburgerMenu