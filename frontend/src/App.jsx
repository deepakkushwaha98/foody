import {Routes , Route, Navigate} from "react-router-dom"
import SignUp from "./assets/pages/SignUp";
import SignIn from "./assets/pages/SignIn";
import Forgetpasswordd from "./assets/pages/Forgetpasswordd.jsx";
import useGetCurrentUser from "./hooks/useGetCurrentUser.jsx";
import { useSelector } from "react-redux";
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
function App() {
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  UseGetShopByCity()
  UseGetItemByCIty()
  const {userData} = useSelector(state =>state.user)
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
    
    </Routes>
  );
}

export default App;
