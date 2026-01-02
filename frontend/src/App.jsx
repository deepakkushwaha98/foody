import {Routes , Route} from "react-router-dom"
import SignUp from "./assets/pages/SignUp";
import SignIn from "./assets/pages/SignIn";
import Forgetpasswordd from "./assets/pages/Forgetpasswordd.jsx";
export const serverUrl = "http://localhost:3000"

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/forget-password' element={<Forgetpasswordd/>} />
        
      
    </Routes>
  );
}

export default App;
