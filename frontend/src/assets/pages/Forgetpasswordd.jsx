import React , {useState}from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; 
const Forgetpasswordd = () => {

  const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd"
    
    const navigate = useNavigate();

    const [newPassword , setNewPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const [otp , setOtp] = useState("");
    const [step , setStep] = useState(1);  
    const [email , setEmail] = useState("");
  return (
    <div className="flex w-full items-center justify-center p-4 min-h-screen ">

       <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
          <div className="flex items-center  gap-5 ">
             <IoArrowBack size={20} className="text-[#ff4d3d] mb-4 cursor-pointer" onClick={()=> navigate("/signin")} />
         <h1 className="text-2xl text-[#ff4d2d] font-bold mb-4">Forget Password</h1>
          </div>

          {step === 1 && (
            <div>
               <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pt-4 border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              style={{ border: `1px solid ${borderColor}` }}
            />
          </div>
           
           
          <button className="w-full mt-4 py-2 rounded-lg bg-[#de5b44]  hover:bg-[#e64323] cursor-pointer text-white transition" >
             Send otp
            </button>


            </div>
           
          )}

          {step ==2 &&  (
            <div>
               <div>
            <label className="block text-gray-700 font-medium mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your otp"
              className="w-full pt-4 border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              style={{ border: `1px solid ${borderColor}` }}
            />
          </div>
           
           
          <button className="w-full mt-4 py-2 rounded-lg bg-[#de5b44]  hover:bg-[#e64323] cursor-pointer text-white transition" >
             Verify
            </button>


            </div>
           
          )}


            {step ==3 &&  (
            <div>
               <div>
            <label className="block text-gray-700 font-medium mb-1">
              Enter New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full pt-4 border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              style={{ border: `1px solid ${borderColor}` }}
            />

          </div>

             <div>
            <label className="block text-gray-700 font-medium mb-1">
             Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" your confirm password"
              className="w-full pt-4 border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              style={{ border: `1px solid ${borderColor}` }}
            />
            
          </div>
           
           
          <button className="w-full mt-4 py-2 rounded-lg bg-[#de5b44]  hover:bg-[#e64323] cursor-pointer text-white transition" >
             Reset Password
            </button>


            </div>
           
          )}


       </div>
      
    </div>
  );
};

export default Forgetpasswordd;
