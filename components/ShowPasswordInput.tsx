"use client"

import React, { useState } from 'react'
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";

type ShowPasswordInputProps = {
  children: (showPassword: boolean) => React.ReactNode;
};

const ShowPasswordInput = ({ children }: ShowPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      {children(showPassword)}
      <button
        type="button"
        title={showPassword ? "Hide password" : "Show password"}
        onClick={toggleShowPassword}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 bg-white dark:bg-neutral-700 focus:outline-none rounded-full flex justify-center items-center hover:brightness-90 active:brightness-75 duration-100 w-8 h-8"
      >
        {showPassword ? <RxEyeOpen /> : <RxEyeClosed />}
      </button>
    </div>
  );
};

export default ShowPasswordInput;
