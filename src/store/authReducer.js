import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  username: localStorage.getItem("username") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", state.username);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = "";
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
