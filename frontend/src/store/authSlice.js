import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  status: null,
  loading: true, // ✅ added
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("userAuth", JSON.stringify(true));
    },
    logout: (state, action) => {
      state.status = false;
      state.userData = null;
      state.loading = false;
      state.error = null;
      // localStorage.removeItem("userAuth")
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    register: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("userAuth", JSON.stringify(true));
    },
    setUser: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { login, logout, setLoading, setError, register, setUser } =
  authSlice.actions;

export default authSlice.reducer;
