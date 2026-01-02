import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { serverUrl } from '../../App';
const SignUp = () => {
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd"

    const [showPassword , setPassword] = useState(false);

    function toggle(){
       setPassword(prev =>!prev);
    }
    const navigate = useNavigate()

    const [role , setRole] = useState("user")

    const [fullName , setFullName] = useState()
    const [email , setEmail] = useState()
    const [mobile , setMobile] = useState()
    const [password, setPpassword] = useState()

    
    const handleSignUp = async () => {
       try{
          const result = await axios.post(`${serverUrl}/api/auth/signup` ,{
            fullName , email , mobile , password , role
          } , {withCredentials: true}
        )
        console.log(result)

       }
       catch(err){
         console.log(err)

       }
    }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 ' style={{backgroundColor:bgColor}}>
        <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `} style={{ border: `1px solid ${borderColor}` }} >
            <h1 className={`text-3xl font-bold mb-2`} style={{color:primaryColor}}>FOODY</h1>
            <p>“Create an account to order your favorite food in minutes."</p>

            <div className='mb-4'>
                <label htmlFor="fullName" className='block text-gray-700 font-medium mb-1'>fullName</label>
                <input type="text" className='w-full border rounded-lg px-3 py-2 focus-outline-none focus:border-orange-500' placeholder='enter fullname'
                style={{ border: `1px solid ${borderColor}` }} value={fullName} onChange={(e) => setFullName(e.target.value)}  />
            </div>


             <div className='mb-4'>
                <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>email:</label>
                <input type="text" value={email} onChange={(e) =>setEmail(e.target.value)} className='w-full border rounded-lg px-3 py-2 focus-outline-none focus:border-orange-500'  placeholder='enter email' style={{ border: `1px solid ${borderColor}` }} />
            </div>



             <div className='mb-4'>
                <label htmlFor="mobile" className='block text-gray-700 font-medium mb-1'>mobile:</label>
                <input type="text" className='w-full border rounded-lg px-3 py-2 focus-outline-none focus:border-orange-500' 
                placeholder='enter your mobile no:' style={{ border: `1px solid ${borderColor}` }}  value={mobile} onChange={(e)=> setMobile(e.target.value)}/>


            </div>


             <div className='mb-4'>
                <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>password</label>
                <div className='relative'>
                    <input type={showPassword? "text": "password"} value={password} onChange={(e) => setPpassword(e.target.value)} className='w-full border rounded-lg px-3 py-2 focus-outline-none focus:border-orange-500' placeholder='enter password' style={{ border: `1px solid ${borderColor}` }} />
                    <button className='absolute right-3 top-[14px] text-gray-500 ' onClick={toggle}>{ showPassword ? <FaEye/> : <FaEyeSlash/>}</button>
               </div>
               
             </div>
               

               
             <div className='mb-4'>
                <label htmlFor="" className='block text-gray-700 font-medium mb-1'>role</label>
                <div className='relative flex justify-between gap-2 mx-2 my-2'>
                    {["user" , "owener" , "deliveryBoy"].map((r)=>(
                       <button className='flex-1  border rounded-lg px-3 py-2 text-center font-medium transition-colors' 
                       onClick={()=>setRole(r)}
                       style={
                        role == r? {backgroundColor:primaryColor , color:"white"}:{border:`1px solid ${primaryColor}` , color:"#333"}
                       }>{r}</button>
                    ))}
               </div>
               
             </div>

             <button className="w-full mt-4 py-2 rounded-lg bg-[#de5b44]  hover:bg-[#e64323] cursor-pointer text-white transition" onClick={handleSignUp}>
             Sign Up
            </button>

            <button className='w-full mt-4 flex items-center py-2 justify-center gap-2 px-4 transition duration-200 border rounded-lg  border-gray-400 hover:bg-gray-100'>< FcGoogle size={20} />Sign Up with google</button>
                 <p  className='text-center mt-6 cursor-pointer' onClick={()=> navigate("/signin")} >Already have an account ? <span className='text-[#ff4d2d]'>Sign in</span> </p>
        </div>

        
        
      
    </div>
  )
}

export default SignUp
