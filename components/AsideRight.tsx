import React from 'react'

type AsideRightProps = {
  children: React.ReactNode;
}

// sticky side box
const AsideRight: React.FC<AsideRightProps> = ({ children }) => {
  return (
    <aside className='hidden lg:block'>
      {children}
    </aside>
  )
}

export default AsideRight