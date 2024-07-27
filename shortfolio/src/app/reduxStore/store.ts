import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth.slice';
import accountCreationReducer from '../features/accountCreation.slice';

export const store = configureStore({
    reducer: {
        authCheck: authReducer,
        accountCreated: accountCreationReducer,
    },
})