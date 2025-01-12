"use client";

import React, { useState } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import BottomSheet from './BottomSheet';
import DropdownMenu from './DropdownMenu';

/*
  - trigger: Elemento que abre el menú
  - children: Contenido del menú
*/

/*
  Wrap all the children (content) within the component
*/

type ResponsiveMenuProps = {
  trigger: React.ReactElement;
  dropdownMenuOptions?: {
    width?: number;
    canClickOtherElements?: boolean;
    positionX?: 'left' | 'center' | 'right';
    positionY?: 'top' | 'bottom';
  };
  children: (
    menuOpen: boolean,
    setMenuOpen: (open: boolean) => void,
  ) => React.ReactNode;
};

// pasar por props customizaciones de ambos componentes
const ResponsiveMenu = ({ trigger, dropdownMenuOptions, children }: ResponsiveMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 768px)');

  return (
    <div>
      {isLargeScreen ? (
        // Dropdown menu para pantallas grandes
        <DropdownMenu
          trigger={trigger}
          positionX={dropdownMenuOptions?.positionX || 'right'}
          positionY={dropdownMenuOptions?.positionY || 'bottom'}
          canClickOtherElements={dropdownMenuOptions?.canClickOtherElements ?? true}
          isOpen={menuOpen}
          setOpen={setMenuOpen}
        >
          <div
            className={`bg-white dark:bg-neutral-900 rounded-lg overflow-hidden select-none py-1 border border-gray-200 dark:border-neutral-700/70 ${dropdownMenuOptions?.width ? 'w-auto' : 'w-max'
              }`}
            style={dropdownMenuOptions?.width ? { width: `${dropdownMenuOptions.width}px` } : undefined}
          >
            {children(menuOpen, setMenuOpen)}
          </div>
        </DropdownMenu>
      ) : (
        // Bottom sheet para pantallas pequeñas
        <BottomSheet trigger={trigger} isOpen={menuOpen} setOpen={setMenuOpen}>
          {children(menuOpen, setMenuOpen)}
        </BottomSheet>
      )}
    </div>
  );
};

export default ResponsiveMenu;