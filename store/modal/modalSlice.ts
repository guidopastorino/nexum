// (Redux slice for global modal state)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  modalId: string | null;
  content: React.ReactNode | null;
}

const initialState: ModalState = {
  isOpen: false,
  modalId: null,
  content: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ modalId: string; content: React.ReactNode }>
    ) => {
      state.isOpen = true;
      state.modalId = action.payload.modalId;
      state.content = action.payload.content;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalId = null;
      state.content = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;