import React, { useState } from 'react';
import ReactDOM from 'react-dom'

type ShowUserProfileImageProps = {
  children: React.ReactNode;
  userProfileImageUrl: string;
}

const ShowUserProfileImage = ({ children, userProfileImageUrl }: ShowUserProfileImageProps) => {
  const [viewer, setViewer] = useState<boolean>(false);

  return (
    <>
      {React.cloneElement(children as React.ReactElement, { onClick: () => setViewer(!viewer) })}

      {viewer && (
        <>
          {ReactDOM.createPortal(
            <div className="fixed inset-0 z-[999] flex justify-center items-center">
              <div
                onClick={() => setViewer(false)}
                className="absolute inset-0 bg-black/70 z-40"
              ></div>

              <img
                className="max-w-xl object-contain relative z-50"
                src={userProfileImageUrl}
                alt="profile image"
              />
            </div>,
            document.body
          )}
        </>
      )}
    </>
  );
}

export default ShowUserProfileImage;