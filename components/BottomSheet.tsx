'use client';

import { useState } from 'react';
import { Drawer } from 'vaul';

type BottomSheetProps = {
  trigger: React.ReactElement;
  children: React.ReactNode;
  isOpen?: boolean; // Estado opcional
  setOpen?: (open: boolean) => void; // Función de manejo opcional
};

const BottomSheet = ({ trigger, children, isOpen, setOpen }: BottomSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Usar el estado interno si no se proporcionan isOpen y setOpen
  const openState = isOpen !== undefined ? isOpen : internalOpen;
  const toggleOpen = setOpen || setInternalOpen;

  return (
    <Drawer.Root open={openState} onOpenChange={toggleOpen}> 
      <Drawer.Trigger asChild>
        {trigger}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" onClick={() => toggleOpen(false)} />
        <Drawer.Content className="dark:bg-neutral-800 bg-white text-black dark:text-white h-fit fixed bottom-0 left-0 right-0 outline-none z-50 pt-1">
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default BottomSheet;