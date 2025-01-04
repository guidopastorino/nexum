import React from 'react';

const UnfollowUserButton: React.FC<{ onClick: (e: any) => void }> = ({ onClick }) => {
  return (
    <button
      className="bg-gray-300 h-9 rounded-full py-3 px-6 text-black font-medium flex justify-center items-center"
      onClick={onClick}
    >
      Unfollow
    </button>
  );
};

export default UnfollowUserButton;