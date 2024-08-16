import { createSlice } from "@reduxjs/toolkit";

const notificationslice = createSlice({
  name: "notification",
  initialState: {
    likenotification: [],
  },
  reducers: {
    setlikenotification: (state, action) => {
      if (action.payload.type == "like") {
        state.likenotification.push(action.payload);
      } else if (action.payload.type == "dislike") {
        state.likenotification = state.likenotification.filter(
          (item) => item.userid !== action.payload.userid
        );
      }
    },
    setclearnotification: (state, action) => {
      state.likenotification = action.payload;
    },
  },
});

export const { setlikenotification, setclearnotification } =
  notificationslice.actions;
export default notificationslice.reducer;
