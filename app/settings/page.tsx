"use client";

import useUser from '@/hooks/useUser';
import React from 'react';
import {
  BsPersonPlus,
  BsPerson,
  BsShieldLock,
  BsPersonLock,
  BsPersonHearts,
  BsVolumeMute,
  BsUniversalAccessCircle,
  BsInfoCircle,
} from "react-icons/bs";
import { GrMultimedia } from "react-icons/gr";
import { BiPaint } from "react-icons/bi";
import AsideRight from '@/components/AsideRight';
import Link from 'next/link';
import { IoMdArrowForward } from "react-icons/io";
import { HiArrowNarrowRight } from "react-icons/hi";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { signOut } from 'next-auth/react';

type SettingsLinksProps = {
  icon: React.ReactNode;
  text: string;
  route: string; // /settings/text
};

const page = () => {
  const user = useUser();

  const settingsLinks: SettingsLinksProps[] = [
    {
      icon: <BsPersonPlus size={21} />,
      text: "Agregar una cuenta",
      route: "/settings/add-account"
    },
    {
      icon: <BsPerson size={21} />,
      text: "Mi cuenta",
      route: "/settings/account"
    },
    {
      icon: <GrMultimedia size={21} />,
      text: "Multimedia",
      route: "/settings/multimedia"
    },
    {
      icon: <BiPaint size={21} />,
      text: "Apariencia",
      route: "/settings/appearance"
    },
    {
      icon: <BsInfoCircle size={21} />,
      text: "Acerca de",
      route: "/settings/about"
    }
  ];

  return (
    <>
      <div className="w-full">
        <div className='p-3 flex flex-col justify-center items-center gap-3 mb-5'>
          <img className='w-24 h-24 object-cover rounded-full' src={user.profileImage || ''} alt={user?.fullname!} />
          <div className="flex justify-center items-center flex-col">
            <span className='font-bold text-3xl'>{user.fullname}</span>
            <span>@{user.username}</span>
          </div>
        </div>
        {/* Lista de enlaces de configuración */}
        {settingsLinks.map((el, i) => (
          <Link
            key={i} // Clave única para cada elemento
            href={el.route}
            className="px-4 py-2.5 flex justify-between items-center gap-3 itemHover"
          >
            <div className="flex justify-center items-center gap-3">
              {el.icon}
              <span>{el.text}</span>
            </div>
            <span className='text-2xl'>&#8250;</span>
          </Link>
        ))}

        <div
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2.5 flex justify-start items-center gap-3 itemHover"
        >
          <span className='text-red-500'>Cerrar sesión</span>
        </div>

        <div
          className="px-4 py-2.5 flex justify-start items-center gap-3 itemHover"
        >
          <span className='text-red-500'>Desactivar cuenta</span>
        </div>
      </div>

      {/* Aside derecho */}
      <AsideRight>
        aside
      </AsideRight>
    </>
  );
};

export default page;
