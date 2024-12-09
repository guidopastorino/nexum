import ReactDOM from 'react-dom';
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/store/index";
import { clearToast } from '@/store/toast/toastSlice';
import { useEffect } from 'react';

const Toast = () => {
  const dispatch = useDispatch();
  const message = useSelector((state: RootState) => state.toast.message);

  useEffect(() => {
    if (message !== "") {
      const timer = setTimeout(() => dispatch(clearToast()), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return ReactDOM.createPortal(
    <div className="w-[90%] max-w-max fixed bottom-5 left-1/2 translate-x-[-50%] z-50 flex justify-between items-center gap-3 p-3 rounded-md shadow-lg text-white bg-orange-700">
      <span className="truncate line-clamp-1 w-full">{message}</span>
      <RxCross2 onClick={() => dispatch(clearToast())} size={23} className='shrink-0 cursor-pointer duration-100 hover:scale-105' />
    </div>,
    document.body
  );
};

export default Toast;