import { createSlice } from "@reduxjs/toolkit"

const CART_STORAGE_KEY = "foody-cart-state"

const getStoredFlag = (key) => {
   try {
      return typeof window !== "undefined" && window.localStorage.getItem(key) === "true"
   } catch {
      return false
   }
}

const loadCartState = () => {
   try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      if (!raw) return { cartItems: [], totalAmount: 0, cartOutletId: null, cartOutletName: null }
      const parsed = JSON.parse(raw)
      return {
         cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
         totalAmount: Number(parsed.totalAmount || 0),
         cartOutletId: parsed.cartOutletId || null,
         cartOutletName: parsed.cartOutletName || null,
      }
   } catch {
      return { cartItems: [], totalAmount: 0, cartOutletId: null, cartOutletName: null }
   }
}

const persistedCart = typeof window !== "undefined" ? loadCartState() : { cartItems: [], totalAmount: 0, cartOutletId: null, cartOutletName: null }

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
      isCartDrawerOpen:false,
      hideMultipleOrdersBanner:getStoredFlag('hideMultipleOrdersBanner'),
      hideOneOutletBanner:getStoredFlag('hideOneOutletBanner'),
        currentCity:null,
        currentState:null,
        currentAddress:null,
        shopInMyCity:null,
        itemsInMyCity:null,
      cartItems:persistedCart.cartItems,
      totalAmount:persistedCart.totalAmount,
      cartOutletId:persistedCart.cartOutletId,
      cartOutletName:persistedCart.cartOutletName,
        myOrders:[],
      availableDeliveryOrders:0,
      deliveryEarnings:0,
        searchItems:null


    },
    reducers:{
        setUserData:(state , action) =>{
           state.userData = action.payload
        },
        openCartDrawer:(state) =>{
           state.isCartDrawerOpen = true
        },
        closeCartDrawer:(state) =>{
           state.isCartDrawerOpen = false
        },
        dismissMultipleOrdersBanner:(state) =>{
           state.hideMultipleOrdersBanner = true
        },
        dismissOneOutletBanner:(state) =>{
           state.hideOneOutletBanner = true
        },
        setCurrentCity:(state , action) =>{
           state.currentCity = action.payload
        },
         setCurrentState:(state , action) =>{
           state.currentState = action.payload
        },
        setCurrentAddress:(state , action) =>{
           state.currentAddress = action.payload
        },
        setShopInMyCity:(state , action) =>{
           state.shopInMyCity = action.payload
        },
         setItemInMyCity:(state , action) =>{
           state.itemsInMyCity = action.payload
        },
        addToCart :(state , action)=>{
          const cartItem = action.payload
          const existingItem = state.cartItems.find(i=>i.id ==cartItem.id)
               if(!state.cartOutletId){
                  state.cartOutletId = cartItem.shopId || cartItem.shop?._id || cartItem.shop || null
                  state.cartOutletName = cartItem.shopName || cartItem.shop?.name || null
               }
          if(existingItem){
            existingItem.quantity+= cartItem.quantity;

          }
          else{
            state.cartItems.push(cartItem)
          }

          state.totalAmount = state.cartItems.reduce(
  (sum, i) => sum + i.price * i.quantity,
  0
);

          
        },

        updateQuantity:(state,action)=>{
         const {id,quantity} = action.payload
         const item = state.cartItems.find(i=>i.id==id)
         if(item){
            item.quantity = Math.min(99, Math.max(1, Number(quantity) || 1))
         }
          state.totalAmount = state.cartItems.reduce(
  (sum, i) => sum + i.price * i.quantity,
  0
);

        },

        removeCartItem:(state,action)=>{
         state.cartItems=state.cartItems.filter(i=>i.id!==action.payload)
          state.totalAmount = state.cartItems.reduce(
  (sum, i) => sum + i.price * i.quantity,
  0
);

               if(state.cartItems.length === 0){
                  state.cartOutletId = null
                  state.cartOutletName = null
               }

        },

            clearCart:(state)=>{
             state.cartItems=[]
             state.totalAmount=0
             state.cartOutletId=null
             state.cartOutletName=null
            },

            setCartFromServer:(state, action)=>{
             const payload = action.payload || {}
             state.cartItems = Array.isArray(payload.cartItems) ? payload.cartItems : []
             state.totalAmount = Number(payload.totalAmount || 0)
             state.cartOutletId = payload.cartOutletId || null
             state.cartOutletName = payload.cartOutletName || null
            },


        setMyOrders:(state , action)=>{
         state.myOrders=action.payload
        },
      setAvailableDeliveryOrders:(state, action)=>{
       state.availableDeliveryOrders = Math.max(0, Number(action.payload) || 0)
      },
      incrementAvailableDeliveryOrders:(state)=>{
       state.availableDeliveryOrders += 1
      },
      decrementAvailableDeliveryOrders:(state)=>{
       state.availableDeliveryOrders = Math.max(0, state.availableDeliveryOrders - 1)
      },
      setDeliveryEarnings:(state, action)=>{
       state.deliveryEarnings = Math.max(0, Number(action.payload) || 0)
      },
        addMyOrder:(state , action)=>{
         state.myOrders=[action.payload,...state.myOrders]
        },


        updateOrderStatus:(state , action)=>{
         const {orderId,shopId,status,assignedDeliveryBoy} = action.payload
         const order = state.myOrders.find(o=>o._id==orderId)
         if(order){
            if(order.shopOrders && order.shopOrders.shop._id==shopId){
               order.shopOrders.status=status
               if(assignedDeliveryBoy){
                 order.shopOrders.assignedDeliveryBoy = assignedDeliveryBoy
               }
            }
         }
        },

        updateRealTimeOrderStatus:(state , action)=>{
         if (!Array.isArray(state.myOrders)) return
         const {orderId,shopId,status,assignedDeliveryBoy} = action.payload
         const order = state.myOrders.find(o=>o._id==orderId)
         if(order){
            const shopOrder = order.shopOrders.find(so=>so.shop._id==shopId)
            if(shopOrder){
               shopOrder.status=status
               if(assignedDeliveryBoy){
                 shopOrder.assignedDeliveryBoy = assignedDeliveryBoy
               }
            }
         }
        },

        
        setSearchItems:(state , action)=>{
         state.searchItems=action.payload
        }




    }
})

export const {setUserData, openCartDrawer, closeCartDrawer, dismissMultipleOrdersBanner, dismissOneOutletBanner, updateRealTimeOrderStatus, updateOrderStatus ,setSearchItems,setMyOrders,addMyOrder , setAvailableDeliveryOrders, incrementAvailableDeliveryOrders, decrementAvailableDeliveryOrders, setDeliveryEarnings, setCurrentCity, removeCartItem , clearCart, setCartFromServer, setCurrentState , setCurrentAddress , setShopInMyCity , setItemInMyCity, updateQuantity ,addToCart} = userSlice.actions
export default userSlice.reducer
