"use client"

import React from 'react';
import { useTheme } from 'next-themes';

type LogoProps = {
  size?: number;
};

const Logo = ({ size = 48 }: LogoProps) => {
  const { theme, systemTheme } = useTheme();

  const fillColor = theme === 'system'
    ? systemTheme === 'dark' ? '#fff' : '#000'
    : theme === 'dark' ? '#fff' : '#000';

  return (
    <svg
      fill={fillColor}
      width={size}
      height={size}
      viewBox="0 0 23.631 23.631"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="object-contain shrink-0"
    >
      <polygon points="0,0.663 9.401,0.663 15.882,7.146 15.882,14.127 5.307,3.608 5.274,22.969 0,22.969" />
      <polygon points="23.631,22.969 14.232,22.969 7.752,16.485 7.752,9.501 18.327,20.018 18.359,0.662 23.631,0.662" />
    </svg>
  );
};

export default Logo;