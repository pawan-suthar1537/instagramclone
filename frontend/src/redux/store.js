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
import NotificationSlice from "./slice/NotificationSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["socket"],
};

const rootReducer = combineReducers({
  auth: AuthSlice,
  post: PostSlice,
  socket: Socketslice,
  chat: ChatSlice,
  notification: NotificationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socketio/setSocket"], // Add other non-serializable actions if needed
        ignoredPaths: ["socket.socket"], // Add other non-serializable state paths if needed
      },
    }),
});

export default store;
