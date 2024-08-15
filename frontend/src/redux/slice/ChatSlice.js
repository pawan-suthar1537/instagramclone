import { createSlice } from "@reduxjs/toolkit";

const chatslice = createSlice({
  name: "chat",
  initialState: {
    onlineusers: [],
    messages: [],
  },
  reducers: {
    setonlineusers: (state, action) => {
      state.onlineusers = action.payload;
    },
    setmessagess: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setonlineusers, setmessagess } = chatslice.actions;
export default chatslice.reducer;
