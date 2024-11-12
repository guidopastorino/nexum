"use client"

import React, { useEffect, useRef, useState } from 'react';

interface DropdownMenuProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  positionX?: 'left' | 'center' | 'right';
  positionY?: 'top' | 'bottom';
  canClickOtherElements?: boolean; // if true, user can click other elements while menu is open, otherwise, cannot click elements
  isOpen?: boolean; // Estado opcional
  setOpen?: (open: boolean) => void; // Función de manejo opcional
}

// Agregar más customización (posicion, efecto, etc...)
const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children, positionX, positionY, canClickOtherElements = false, isOpen, setOpen }) => {
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const MenuRef = useRef<HTMLDivElement>(null);

  const [internalOpen, setInternalOpen] = useState(false);

  // Usar el estado interno si no se proporcionan isOpen y setOpen
  const openState = isOpen !== undefined ? isOpen : internalOpen;
  const toggleOpen = setOpen || setInternalOpen;

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target === ButtonRef.current) return;
      if (!MenuRef.current?.contains(e.target as Node)) {
        toggleOpen(false);
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
      {isOpen && !canClickOtherElements && <div className="w-full h-dvh bg-transparent cursor-default fixed z-50 top-0 left-0"></div>} {/* background */}
      <div className='relative w-max shrink-0'>
        {React.cloneElement(trigger, { ref: ButtonRef, onClick: () => toggleOpen(!isOpen) })}
        {isOpen && <div ref={MenuRef} className={`absolute ${positionX ? positionXClasses : "right-0"} z-50 shadow-lg`} style={positionYstyles}>
          {children}
        </div>}
      </div>
    </>
  );
};

export default DropdownMenu;