"use client"

import React from 'react';
import { useTheme } from 'next-themes';

type LoaderProps = {
  width?: number;
  height?: number;
  color?: string;
  borderWidth?: number;
};

const Loader = ({ width = 48, height = 48, color, borderWidth = 4 }: LoaderProps) => {
  const { theme, systemTheme } = useTheme();

  let loaderColor: string;

  if (color) {
    loaderColor = color;
  } else {
    if (theme === 'system') {
      loaderColor = systemTheme === 'dark' ? '#fff' : '#000';
    } else {
      loaderColor = theme === 'dark' ? '#fff' : '#000';
    }
  }

  return (
    <span
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: `${borderWidth}px solid ${loaderColor}`,
        borderTop: `${borderWidth}px solid transparent`,
      }}
      className="inline-block border-4 rounded-full border-solid animate-spin"
    ></span>
  );
};

export default Loader;

export const StrokeLoader = ({ size = 30 }: { size?: number }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <svg viewBox="0 0 32 32" width={size} height={size} className='object-contain shrink-0 animate-rotate'>
        {/* full circle */}
        <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: '#c2410c', opacity: 0.4 }}></circle>
        {/* 1/4 circle */}
        <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: '#ea580c80', strokeDasharray: 80, strokeDashoffset: 60 }}></circle>
      </svg>
    </div>
  )
}