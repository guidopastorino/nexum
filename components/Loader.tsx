import React from 'react';

type LoaderProps = {
  width?: number;
  height?: number;
  color?: string;
  borderWidth?: number;
};

const Loader = ({ width = 48, height = 48, color = '#fff', borderWidth = 4 }: LoaderProps) => {
  return (
    <span
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: `${borderWidth}px solid ${color}`,
        borderTop: `${borderWidth}px solid transparent`,
      }}
      className="inline-block border-4 rounded-full border-solid animate-spin"
    ></span>
  );
};

export default Loader;