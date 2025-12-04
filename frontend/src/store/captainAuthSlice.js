import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    captainData: null,
    status: false,
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
    }
})

export const { login, logout, setLoading, setError, register, setUser } = captainSlice.actions;

export default captainSlice.reducer;