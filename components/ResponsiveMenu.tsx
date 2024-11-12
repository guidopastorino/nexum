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
  children: (
    menuOpen: boolean,
    setMenuOpen: (open: boolean) => void,
  ) => React.ReactNode;
};

// pasar por props customizaciones de ambos componentes
const ResponsiveMenu = ({ trigger, children }: ResponsiveMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 768px)');

  return (
    <div>
      {isLargeScreen ? (
        // Dropdown menu para pantallas grandes
        <DropdownMenu
          trigger={trigger}
          positionX='right'
          canClickOtherElements={true}
          isOpen={menuOpen}
          setOpen={setMenuOpen}
        >
          <div className='dark:bg-neutral-800 rounded-lg overflow-hidden w-max select-none py-1 border dark:border-neutral-600/15'>
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