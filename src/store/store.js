import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import canvasReducer from "./canvasReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    canvas: canvasReducer,
  },
});

// Store to browser console
if (typeof window !== "undefined") {
  window.store = store;
}

export default store;
