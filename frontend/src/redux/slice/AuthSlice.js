import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedusers: [],
    selecteduser: null,
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
    setselecteduser: (state, action) => {
      state.selecteduser = action.payload;
    },
  },
});

export const {
  setUser,
  setToken,
  setselecteduser,
  setsuggestedusers,
  setuserprofile,
} = authslice.actions;
export default authslice.reducer;
