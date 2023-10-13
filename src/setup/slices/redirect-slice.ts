import { createSlice } from "@reduxjs/toolkit";

const redirectSlice = createSlice({
  name: "redirect",
  initialState: {
    path: null,
  },
  reducers: {
    setRedirectPath: (state, action) => {
      state.path = action.payload;
    },
    clearRedirectPath: (state) => {
      state.path = null;
    },
  },
});

export const { setRedirectPath, clearRedirectPath } = redirectSlice.actions;

export default redirectSlice;
