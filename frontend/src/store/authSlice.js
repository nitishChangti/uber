import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  status: false,     // isAuthenticated
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("userAuth", JSON.stringify(true));
    },
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("userAuth", JSON.stringify(true));
    },
    register: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("userAuth", JSON.stringify(true));
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("userAuth");
      localStorage.removeItem("accessToken");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, login, register, logout, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
