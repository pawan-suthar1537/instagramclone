import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedpost: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedpost = action.payload;
    },
  },
});

export const { setPosts, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
