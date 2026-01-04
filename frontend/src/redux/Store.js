
import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice.js"
export const store = configureStore({
    reducer:{
        user:userSlice,
        owner:ownerSlice
    }
})