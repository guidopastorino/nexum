import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ToastState = {
  message: string;
};

const initialState: ToastState = {
  message: "",
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToast(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    clearToast(state) {
      state.message = "";
    },
  },
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;