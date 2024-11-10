"use client"

import React, { useEffect, useRef, useState } from 'react';

interface DropdownMenuProps {
  button: React.ReactElement;
  children: (
    menuRef: React.RefObject<HTMLDivElement>,
    menu: boolean,
    setMenu: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode;
  positionX?: 'left' | 'center' | 'right';
  positionY?: 'top' | 'bottom';
}

// Agregar más customización (posicion, efecto, etc...)
const DropdownMenu: React.FC<DropdownMenuProps> = ({ button, children, positionX, positionY }) => {
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const MenuRef = useRef<HTMLDivElement>(null);

  const [menu, setMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target === ButtonRef.current) return;
      if (!MenuRef.current?.contains(e.target as Node)) {
        setMenu(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const positionYstyles = { top: (!positionY || positionY === "bottom") ? '100%' : '-100%' };

  // Lógica para manejar la posición horizontal
  let positionXClasses = '';
  if (positionX === 'left') {
    positionXClasses = 'left-0';
  } else if (positionX === 'center') {
    positionXClasses = 'left-1/2 -translate-x-1/2';
  } else if (positionX === 'right') {
    positionXClasses = 'right-0';
  }

  return (
    <>
      {menu && <div className="w-full h-dvh bg-transparent cursor-default fixed z-50 top-0 left-0"></div>} {/* background */}
      <div className='relative w-max shrink-0'>
        {React.cloneElement(button, { ref: ButtonRef, onClick: () => setMenu(!menu) })}
        <div className={`absolute ${positionX ? positionXClasses : "right-0"} z-50 shadow-lg`} style={positionYstyles}>
          {children(MenuRef, menu, setMenu)}
        </div>
      </div>
    </>
  );
};

export default DropdownMenu;


// Usage:
/*
<DropdownMenu
  button={<button className='dark:hover:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg'><BsThreeDots /></button>}
  positionX='left'
>
  {(MenuRef, menu, setMenu) => (
    <>
      {menu && <div ref={MenuRef} className='py-1 bg-neutral-800 rounded-lg overflow-hidden'>
        <div onClick={() => {
          setMenu(!menu)
        }} className='w-max px-3 py-2 bg-neutral-800 active:brightness-95 cursor-pointer hover:bg-neutral-700'>Clear all bookmarks</div>
      </div>}
    </>
  )}
</DropdownMenu>
*/