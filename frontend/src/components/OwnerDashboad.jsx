import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
const OwnerDashboad = () => {
 
   const Navigate = useNavigate()

  const myShopData = useSelector(state => state.owner?.myShopData)
  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
       <Nav/>

       {!myShopData && <div className='flex justify-center items-center p-4 sm:p-6'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100
          hover:shadow-xl transition-shadow duration-300 '>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4 ' />
              <h2>Add your Restaurant</h2>
              <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                Join our food dilivery platfom and reacg thousand of hungry customers every day.
              </p>
              <button className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full
              font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 ' onClick={()=>Navigate("/creat-edit-shop") }>Get Started</button>
            </div>
          </div>
         
       </div> }
     
       

    </div>
  )
}

export default OwnerDashboad
