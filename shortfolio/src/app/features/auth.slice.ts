import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    userData: null,
    value: "logged out"
}

const authSlice = createSlice({
    name: 'authCheck',
    initialState,
    reducers: {
        checkLogin: ( state, action ) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.value = "logged in";
        },
        checkLogout: (state) => {
            state.status = false;
            state.userData = null;
            state.value = "logged out";
        }
    }
})

export const { checkLogin, checkLogout } = authSlice.actions;

export default authSlice.reducer;