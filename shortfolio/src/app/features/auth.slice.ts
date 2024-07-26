import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    userData: null
}

const authSlice = createSlice({
    name: 'authCheck',
    initialState,
    reducers: {
        checkLogin: ( state, action ) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        checkLogout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
})

export const { checkLogin, checkLogout } = authSlice.actions;

export default authSlice.reducer;