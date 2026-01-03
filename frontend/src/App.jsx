import {Routes , Route, Navigate} from "react-router-dom"
import SignUp from "./assets/pages/SignUp";
import SignIn from "./assets/pages/SignIn";
import Forgetpasswordd from "./assets/pages/Forgetpasswordd.jsx";
import useGetCurrentUser from "./hooks/useGetCurrentUser.jsx";
import { useSelector } from "react-redux";
export const serverUrl = "http://localhost:3000"
import Home from "./assets/pages/Home.jsx"
import useGetCity from "./hooks/UseGetCity.jsx";
function App() {
  useGetCurrentUser()
  useGetCity()

  const {userData} = useSelector(state =>state.user)
  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>: <Navigate to={"/"}/> } />
      <Route path='/signin' element={!userData?<SignIn/> : <Navigate to={"/"}/>}/>
      <Route path='/forget-password' element={!userData?<Forgetpasswordd/> : <Navigate to={"/"}/>} />
      <Route path="/" element={userData?<Home/> :<Navigate to={"/signin"}/>} />

        
      
    </Routes>
  );
}

export default App;
