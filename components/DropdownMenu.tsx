"use client";

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

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  positionX,
  positionY = 'bottom',
  canClickOtherElements = false,
  isOpen,
  setOpen,
}) => {
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const MenuRef = useRef<HTMLDivElement>(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const [adjustedPositionY, setAdjustedPositionY] = useState<'top' | 'bottom'>(positionY);

  // Usar el estado interno si no se proporcionan isOpen y setOpen
  const openState = isOpen !== undefined ? isOpen : internalOpen;
  const toggleOpen = setOpen || setInternalOpen;

  const updatePosition = () => {
    if (!MenuRef.current || !ButtonRef.current) return;

    const menuRect = MenuRef.current.getBoundingClientRect();
    const buttonRect = ButtonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Ajustar la posición basado en el espacio disponible
    if (menuRect.height + buttonRect.bottom > viewportHeight) {
      setAdjustedPositionY('top');
    } else {
      setAdjustedPositionY('bottom');
    }
  };

  useEffect(() => {
    if (!openState) return;

    updatePosition(); // Calcular la posición cuando el menú se abre
    window.addEventListener('resize', updatePosition); // Recalcular en resize
    return () => window.removeEventListener('resize', updatePosition);
  }, [openState]);

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

  const positionYstyles =
    adjustedPositionY === 'bottom' ? { top: '100%' } : { bottom: '100%' };

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
      {openState && !canClickOtherElements && (
        <div className="w-full h-dvh bg-transparent cursor-default fixed z-50 top-0 left-0"></div>
      )}{' '}
      {/* background */}
      <div className="relative w-max shrink-0">
        {React.cloneElement(trigger, {
          ref: ButtonRef,
          onClick: () => toggleOpen(!openState),
        })}
        {openState && (
          <div
            ref={MenuRef}
            className={`absolute ${positionX ? positionXClasses : 'right-0'} z-50 shadow-lg`}
            style={positionYstyles}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default DropdownMenu;