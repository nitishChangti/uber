import { configureStore } from "@reduxjs/toolkit";
import captainSlice from "./captainAuthSlice";
import authSlice from "./authSlice";
import socketReducer from "./socketSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    captain: captainSlice,
    socket: socketReducer,
  },
});
