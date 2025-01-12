// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/user/userSlice";
import toastReducer from "@/store/toast/toastSlice";
import modalReducer from "@/store/modal/modalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    toast: toastReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;