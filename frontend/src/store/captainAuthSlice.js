import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    captainData: null,
    status: false,
     earnings: {
    today: 0,
    weekly: 0,
    monthly: 0,
    total: 0,
  }
}

const captainSlice = createSlice({
    name: 'captain',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.captainData = action.payload;
            state.loading = false;
            state.error = null;
            localStorage.setItem('capAuth', JSON.stringify(true));
            console.log(state.captainData)
        },
        logout: (state, action) => {
            state.status = false;
            state.captainData = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('capAuth')
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
            state.captainData = action.payload;
            state.loading = false;
            state.error = null;
            localStorage.setItem('capAuth', JSON.stringify(true));
        },
        setCaptain: (state, action) => {
            state.status = true;
            state.captainData = action.payload;
            state.loading = false;
            state.error = null;
        },
        
    // -------------------------------------------------
    // ⭐ NEW: Full earnings update from API (/earnings)
    // -------------------------------------------------
    setEarnings: (state, action) => {
      state.earnings = { ...action.payload };
      console.log('set earning is',state.earnings);
    },

    // -------------------------------------------------
    // ⭐ NEW: Add earning after finishing a ride
    // -------------------------------------------------
    addEarning: (state, action) => {
      const amount = action.payload;

      state.earnings.today += amount;
      state.earnings.weekly += amount;
      state.earnings.monthly += amount;
      state.earnings.total += amount;
    },
    }
})

export const { login, logout, setCaptain, setLoading, setError, register, setUser,  setEarnings,
  addEarning, } = captainSlice.actions;

export default captainSlice.reducer;