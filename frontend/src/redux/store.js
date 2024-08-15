import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slice/AuthSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import PostSlice from "./slice/PostSlice";
import Socketslice from "./slice/Socketslice";
import ChatSlice from "./slice/ChatSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: AuthSlice,
  post: PostSlice,
  socket: Socketslice,
  chat: ChatSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
