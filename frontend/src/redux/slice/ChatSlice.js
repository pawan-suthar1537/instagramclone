import { createSlice } from "@reduxjs/toolkit";

const chatslice = createSlice({
  name: "chat",
  initialState: {
    onlineusers: [],
  },
  reducers: {
    setonlineusers: (state, action) => {
      state.onlineusers = action.payload;
    },
  },
});

export const { setonlineusers } = chatslice.actions;
export default chatslice.reducer;
