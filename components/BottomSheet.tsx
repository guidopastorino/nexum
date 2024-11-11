// Drawabble bottom sheet component using vaul's drawer component

'use client';

import { Drawer } from 'vaul';

const BottomSheet = () => {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        Open Drawer
      </Drawer.Trigger>
      <Drawer.Portal> {/* can define 'container' prop to enable custom portal for DOM elements */}
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="dark:bg-neutral-800 bg-white text-black dark:text-white h-fit fixed bottom-0 left-0 right-0 outline-none z-50">
          <div className="p-4">
            {Array.from({ length: 10 }).map((_, i) => <li className='w-full block text-start p-2 itemHover'>Lorem, ipsum dolor. {i}</li>)}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default BottomSheet;

/*
  TO-DO:
    - snap points
    - scrollable area
*/ 