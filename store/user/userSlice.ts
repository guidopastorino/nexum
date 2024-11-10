// features/userSlice.ts
import { UserState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  _id: null,
  fullname: null,
  username: null,
  email: null,
  profileImage: null,
  createdAt: null,
  updatedAt: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
      state.fullname = action.payload.fullname;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.profileImage = action.payload.profileImage;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
    },
    clearUser: (state) => {
      state._id = null;
      state.fullname = null;
      state.username = null;
      state.email = null;
      state.profileImage = null;
      state.createdAt = null;
      state.updatedAt = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;