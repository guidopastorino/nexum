import React from 'react';

const FollowUserButton: React.FC<{ onClick: (e: any) => void }> = ({ onClick }) => {
  return (
    <button
      className="bg-blue-600 h-9 rounded-full py-3 px-6 text-white font-medium flex justify-center items-center"
      onClick={onClick}
    >
      Follow
    </button>
  );
};

export default FollowUserButton;
