import { createSlice } from "@reduxjs/toolkit"

const ownerSlice = createSlice({
    name:"owner",
    initialState:{
        myShopData:null,
        myShopLoading:false

    },
    reducers:{
        setMyShopData:(state , action) =>{
           state.myShopData = action.payload
        },
        setMyShopLoading:(state, action) => {
           state.myShopLoading = action.payload
        }
    }
})

export const {setMyShopData, setMyShopLoading } = ownerSlice.actions
export default ownerSlice.reducer
