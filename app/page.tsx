"use client";

import AsideRight from "@/components/AsideRight";
import BottomSheet from "@/components/BottomSheet";
import useScroll from "@/hooks/useScroll";
import { useRef } from "react";

/*
  <div>
    {status === "authenticated" || status === "loading" ? (
      <button className='m-3 border bg-gray-100' onClick={() => alert(generateSqid())}>Like</button>
    ) : (
      <AuthModal buttonTrigger={<button className='m-3 border bg-gray-100'>Like</button>} />
    )}

    {JSON.stringify(session?.user)}

    {status == "authenticated" && <button onClick={() => signOut({ callbackUrl: "/" })}>Cerrar sesión</button>}
  </div>
*/

const Page = () => {
  return (
    <>
      <div className='w-full overflow-hidden'>
        <BottomSheet>
          {Array.from({ length: 10 }).map((_, i) => <li className='w-full block text-start p-2 itemHover'>Lorem, ipsum dolor. {i}</li>)}
        </BottomSheet>
      </div>

      <AsideRight>
        aside right
      </AsideRight>
    </>
  );
};

export default Page;


const FeedsNav = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Cambiado a HTMLDivElement

  const {
    scrollPosition,
    scrollToLeft,
    scrollToRight,
    showButtonLeft,
    showButtonRight
  } = useScroll(scrollContainerRef);

  return (
    <div className="w-full relative">
      <div
        ref={scrollContainerRef} // Aquí no hay problemas, ya que es un HTMLDivElement
        className="flex justify-start items-center overflow-x-auto space-x-4 p-4 w-full"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex-shrink-0 w-48 h-48 bg-blue-500">Item 1</div>
        <div className="flex-shrink-0 w-48 h-48 bg-red-500">Item 2</div>
        <div className="flex-shrink-0 w-48 h-48 bg-green-500">Item 3</div>
        <div className="flex-shrink-0 w-48 h-48 bg-yellow-500">Item 4</div>
        <div className="flex-shrink-0 w-48 h-48 bg-purple-500">Item 5</div>
      </div>

      {/* Botones de desplazamiento */}
      {showButtonLeft && (
        <button
          onClick={scrollToLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
        >
          Left
        </button>
      )}
      {showButtonRight && (
        <button
          onClick={scrollToRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
        >
          Right
        </button>
      )}
    </div>
  );
};