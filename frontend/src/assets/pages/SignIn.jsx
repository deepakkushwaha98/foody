import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { serverUrl } from '../../App';
const SignIn = () => {
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd"

    const [showPassword , setPassword] = useState(false);

    function toggle(){
       setPassword(prev =>!prev);
    }
    const navigate = useNavigate()

   
   const [email , setEmail] = useState('')
    
   const [password, setPpassword] = useState('')

    
    const handleSignIn = async () => {
       try{
          const result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
          console.log(result)

       } catch(err){
         console.log(err?.response?.data || err.message)
       }
    }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 ' style={{backgroundColor:bgColor}}>
        <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `} style={{ border: `1px solid ${borderColor}` }} >
            <h1 className={`text-3xl font-bold mb-2`} style={{color:primaryColor}}>FOODY</h1>
            <p>"Sign in using your email and password to access your account and continue."</p>

            

             <div className='mb-4'>
                <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>email:</label>
                <input type="text" value={email} onChange={(e) =>setEmail(e.target.value)} className='w-full border rounded-lg px-3 py-2 focus-outline-none focus:border-orange-500'  placeholder='enter email' style={{ border: `1px solid ${borderColor}` }} />
            </div>





             <div className='mb-4'>
                <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>password</label>
                <div className='relative'>
                    <input type={showPassword? "text": "password"} value={password} onChange={(e) => setPpassword(e.target.value)} className='w-full border rounded-lg px-3 py-2 focus-outline-none focus:border-orange-500' placeholder='enter password' style={{ border: `1px solid ${borderColor}` }} />
                    <button className='absolute right-3 top-[14px] text-gray-500 ' onClick={toggle}>{ showPassword ? <FaEye/> : <FaEyeSlash/>}</button>
               </div>
               
             </div>

             <div className='text-right mb-4 text-[#ff4d2d] cursor-pointer' onClick={()=> navigate("/forget-password")}>
                forget password?
             </div>
               

               
            

             <button className="w-full mt-4 py-2 rounded-lg bg-[#de5b44]  hover:bg-[#e64323] cursor-pointer text-white transition" onClick={handleSignIn}>
             Sign In
            </button>

            <button className='w-full mt-4 flex items-center py-2 justify-center gap-2 px-4 transition duration-200 border rounded-lg 
             border-gray-400 hover:bg-gray-100'>< FcGoogle size={20} />Sign In with google</button>
                 <p  className='text-center mt-6 cursor-pointer' onClick={()=> navigate("/signup")} > want to create new account ? <span className='text-[#ff4d2d]'>Sign up</span> </p>
        </div>

        
        
      
    </div>
  )
}

export default SignIn
