import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice.js"
import mapSlice from "./mapSlice.js"

const CART_STORAGE_KEY = "foody-cart-state"

export const store = configureStore({
    reducer:{
        user:userSlice,
        owner:ownerSlice,
        map:mapSlice,
        
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableStateInvariantMiddleware: true,
        }),
})

if (typeof window !== "undefined") {
    let lastCartState = ""
    store.subscribe(() => {
        const { cartItems, totalAmount, cartOutletId, cartOutletName } = store.getState().user
        const nextState = JSON.stringify({ cartItems, totalAmount, cartOutletId, cartOutletName })
        if (nextState !== lastCartState) {
            lastCartState = nextState
            localStorage.setItem(CART_STORAGE_KEY, nextState)
        }
    })
}