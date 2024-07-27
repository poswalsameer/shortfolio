import { createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

const initialState = {
    detailsAdded : false
}

const accountCreationSlice = createSlice({

    name: 'accountCreated',
    initialState,
    reducers: {

        checkAccountCreation: (state) => {
            state.detailsAdded = true;
        }

    }

})

export const { checkAccountCreation } = accountCreationSlice.actions;
export default accountCreationSlice.reducer;