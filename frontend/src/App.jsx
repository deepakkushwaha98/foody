import {Routes , Route, Navigate} from "react-router-dom"
import SignUp from "./assets/pages/SignUp";
import SignIn from "./assets/pages/SignIn";
import Forgetpasswordd from "./assets/pages/Forgetpasswordd.jsx";
import useGetCurrentUser from "./hooks/useGetCurrentUser.jsx";
import { useDispatch, useSelector } from "react-redux";
export const serverUrl = "http://localhost:3000"
import Home from "./assets/pages/Home.jsx"
import useGetCity from "./hooks/UseGetCity.jsx";
import useGetMyShop from "./hooks/UseGetMyShop.jsx";
import CreatEditShop from "./assets/pages/CreatEditShop.jsx";
import AddItems from "./assets/pages/AddItems.jsx";
import EditItem from "./assets/pages/EditItem.jsx";
import UseGetShopByCity from "./hooks/UseGetShopByCity.jsx";
import UseGetItemByCIty from "./hooks/UseGetItemByCity.jsx";
import CartPage from "./assets/pages/CartPage.jsx";
import CheckOut from "./assets/pages/CheckOut.jsx";
import OrderPlaced from "./assets/pages/orderPlaced.jsx";
import MyOrders from "./assets/pages/MyOrders.jsx";
import useGetMyOrder from "./hooks/UseGetMyOrder.jsx";
import useUpdateLocation from "./hooks/useUpdateLocation.jsx";
import TrackOrderPage from "./components/TrackOrderPage.jsx";
import Shop from "./assets/pages/Shop.jsx";
import { useEffect } from "react";
import { addMyOrder, updateRealTimeOrderStatus } from "./redux/userSlice.js";
import { SocketProvider, useSocket } from "./context/SocketContext.jsx";
import { useState } from "react";

// Inner component that uses the socket context
function AppContent() {
  const dispatch = useDispatch()
  const {userData} = useSelector(state =>state.user)
  const { socket } = useSocket()
  
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  UseGetShopByCity()
  UseGetItemByCIty()
  useGetMyOrder()
  useUpdateLocation()

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    // Listen for new orders (for owners)
    const handleNewOrder = (orderData) => {
      console.log("📦 New order received:", orderData);
      dispatch(addMyOrder(orderData));
    };

    // Listen for order status updates
    const handleStatusUpdate = (statusData) => {
      console.log("🔄 Order status updated:", statusData);
      dispatch(updateRealTimeOrderStatus(statusData));
    };

    // Listen for new delivery assignments (for delivery boys)
    const handleNewAssignment = (assignmentData) => {
      console.log("🚚 New delivery assignment:", assignmentData);
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("update-status", handleStatusUpdate);
    socket.on("newAssignment", handleNewAssignment);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("update-status", handleStatusUpdate);
      socket.off("newAssignment", handleNewAssignment);
    };
  }, [socket, dispatch]);

  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>: <Navigate to={"/"}/> } />
      <Route path='/signin' element={!userData?<SignIn/> : <Navigate to={"/"}/>}/>
      <Route path='/forget-password' element={!userData?<Forgetpasswordd/> : <Navigate to={"/"}/>} />
      <Route path="/" element={userData?<Home/> :<Navigate to={"/signin"}/>} />
      <Route path="/creat-edit-shop" element={userData?<CreatEditShop/> :<Navigate to={"/signin"}/>} />  
      <Route path="/add-item" element={userData?<AddItems/> :<Navigate to={"/signin"}/>} />   
      <Route path="/edit-item/:itemId" element={userData?<EditItem/> :<Navigate to={"/signin"}/>} /> 
      <Route path="/cart" element={userData?<CartPage/> :<Navigate to={"/signin"}/>} /> 
       <Route path="/checkout" element={userData?<CheckOut/> :<Navigate to={"/signin"}/>} /> 
        <Route path="/order-placed" element={userData?<OrderPlaced/> :<Navigate to={"/signin"}/>} /> 
        <Route path="/my-orders" element={userData?<MyOrders/> :<Navigate to={"/signin"}/>} /> 
      <Route path="/track-order/:orderId" element={userData?<TrackOrderPage/> :<Navigate to={"/signin"}/>} />
      <Route path="/shop/:shopId" element={userData?<Shop/> :<Navigate to={"/signin"}/>} />
    </Routes>
  );
}

// Wrapper component that provides SocketProvider
function App() {
  const {userData} = useSelector(state =>state.user)

  return (
    <SocketProvider serverUrl={serverUrl} userId={userData?._id}>
      <AppContent />
    </SocketProvider>
  );
}

export default App;
