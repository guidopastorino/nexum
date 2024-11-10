import React from 'react'

type AsideRightProps = {
  children: React.ReactNode;
}

// sticky side box
const AsideRight: React.FC<AsideRightProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default AsideRight