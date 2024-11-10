'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

const useUser = () => {
  return useSelector((state: RootState) => state.user);
};

export default useUser;