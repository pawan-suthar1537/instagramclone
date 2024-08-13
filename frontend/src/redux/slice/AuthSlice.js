import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedusers: [],
    token: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setsuggestedusers: (state, action) => {
      state.suggestedusers = action.payload;
    },
  },
});

export const { setUser, setToken, setsuggestedusers } = authslice.actions;
export default authslice.reducer;
