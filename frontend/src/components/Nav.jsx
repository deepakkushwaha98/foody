
import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { RxCross1 } from "react-icons/rx";
import { serverUrl } from '../App';
import  axios  from 'axios';
import { setUserData } from '../redux/userSlice';
const Nav = () => {
  const { userData ,city } = useSelector(state => state.user)
   const [show , setShow] = useState(false);
   const [showSearch , setShowSearch] = useState(false);
   const dispatch = useDispatch()

   const handleLogOut = async() =>{
     try{
        const result = await axios.get(`${serverUrl}/api/auth/signout` ,
            {withCredentials:true}
            
        )
        dispatch(setUserData(null));
    }
     catch(err){
        console.log(err);

     }
   }


  return (
    
    <div className="w-full h-[80px] px-4 md:px-10
      flex items-center justify-between md:justify-center
      bg-[#fff9f6] gap-10 ">

     
      <h1 className="text-3xl font-bold text-[#ff4d4d]">
        foody
      </h1>

      {showSearch &&  <div className="md:flex w-[70%] h-[60px] bg-white
        shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[15%] " > <div className="flex items-center w-[30%] gap-2 px-3 border-r">
          <FaLocationDot size={22} className="text-[#ff4d2d]" />
          <span className="text-gray-400 truncate">{city}</span>
        </div>
         <div className="flex items-center w-full gap-2 px-3">
          <IoMdSearch size={22} className="text-[#ff4d2d]" />
          <input
            type="text"
            placeholder="search delicious food..."
            className="outline-none w-full text-gray-700"
          />
        </div>
        </div>}

      
      <div className="hidden md:flex md:w-[40%] h-[60px] bg-white
        shadow-xl rounded-lg items-center gap-4">

        <div className="flex items-center w-[30%] gap-2 px-3 border-r">
          <FaLocationDot size={22} className="text-[#ff4d2d]" />
          <span className="text-gray-400 font-semibold truncate">{city}</span>
        </div>

        <div className="flex items-center w-full gap-2 px-3">
          <IoMdSearch size={22} className="text-[#ff4d2d]" />
          <input
            type="text"
            placeholder="search delicious food..."
            className="outline-none w-full text-gray-700"
          />
        </div>
      </div>

      
      <div className="flex items-center gap-4">
        {!showSearch?  <IoMdSearch size={22} className="text-[#ff4d2d] md:hidden" onClick={() =>setShowSearch(prev => !prev)} /> :<RxCross1 size={22} className="text-[#ff4d2d] md:hidden" onClick={() =>setShowSearch(prev => !prev)}/>}
         
        <div className="relative cursor-pointer">
          <IoCartOutline size={26} className="text-[#ff4d3d]" />
          <span className="absolute -top-2 -right-2 text-xs text-[#ff4d3d]">
            0
          </span>
        </div>

        <button className="hidden md:block px-3 py-1 rounded-lg
          bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm">
          My orders
        </button>

        <div className="flex items-center justify-center
          w-8 h-8 rounded-full bg-[#ff4d2d] text-white font-semibold" onClick={() =>setShow(prev => !prev)  }>
          {userData?.fullName?.slice(0, 1).toUpperCase()}
        </div>

        {
            show && <div className='fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white
        shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]'>
            <div className='text-[17px] font-semibold '>{userData.fullName}</div>
             <div className='md:hidden font-semibold cursor-pointer'>My order</div>
            <div className='text-[#ff4d2d] font-semibold cursor-pointer ' onClick={handleLogOut}>Log Out</div>
        </div>
        }

      </div>
    </div>
  )
}


export default Nav;   