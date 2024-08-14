import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedusers: [],
    token: null,
    userprofile: null,
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
    setuserprofile: (state, action) => {
      state.userprofile = action.payload;
    },
  },
});

export const { setUser, setToken, setsuggestedusers, setuserprofile } =
  authslice.actions;
export default authslice.reducer;
