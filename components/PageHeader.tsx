import React from 'react'
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

type PageHeaderProps = {
  navigateBackButton?: boolean;
  children: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  navigateBackButton,
  children
}) => {
  const router = useRouter()

  const handleNavigateBack = () => {
    if (window.history.length <= 1) {
      router.push("/");
    } else {
      router.back();
    }
  }

  return (
    <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='h-14 w-full z-50 backdrop-blur-sm dark:bg-neutral-900 bg-white flex justify-start items-center cursor-pointer gap-3 pl-3 py-3 pr-4 sticky top-0 border-b borderColor'>
      <button
        onClick={handleNavigateBack}
        className="w-10 h-10 flex justify-center items-center itemHover rounded-full shrink-0"
      >
        <HiArrowNarrowLeft size={21} />
      </button>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default PageHeader
