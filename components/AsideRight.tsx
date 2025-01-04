import React from 'react'

type AsideRightProps = {
  children: React.ReactNode;
}

// sticky side box
const AsideRight: React.FC<AsideRightProps> = ({ children }) => {
  return (
    <aside className='hidden xl:block top-0 sticky overflow-y-auto px-2 py-3 h-dvh'>
      {children}
    </aside>
  )
}

export default AsideRight