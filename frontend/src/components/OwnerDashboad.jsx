import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { FaPen } from "react-icons/fa";
import OwnerItemCard from './OwnerItemCard'
const OwnerDashboad = () => {
 
   const Navigate = useNavigate()

  const myShopData = useSelector(state => state.owner?.myShopData)
  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center  pb-11'>
       <Nav/>

       {!myShopData && <div className='flex justify-center items-center p-4  sm:p-6'>
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


       {myShopData && 
       <div className='w-full   flex flex-col items-center gap-6 sm:px-6'>
        <h1 className='text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-4  '>
           <FaUtensils className='text-[#ff4d2d] w-14 h-14 sm:w-20 sm:h-20 mb-4 ' />Welcome to {myShopData.name}</h1>

           <div className='bg-white shadow-xl rounded-xl overflow-hidden border border-orange-100
           hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative '>
            <div className='absolute top-4 right-4 bg-[#ff4d3d] text-white p-2 rounded-full shadow-md
            hover:bg-orange-600 transition-colors ' onClick={()=> Navigate("/creat-edit-shop") } >
              <FaPen size={20} />

            </div>
             <img src={myShopData.image} alt={myShopData.name} className='w-full h-48 sm:h-64 object-cover' />
              <div className='p-4 sm:p-6'>
            <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>{myShopData.name}</h1>
            <p className='text-gray-500 '>{myShopData.city} , {myShopData.state} </p>
            <p className='text-gray-500 '>{myShopData.address} </p>
          
           </div>
           
           {myShopData.items?.length === 0 && <div className='flex justify-center items-center p-4  sm:p-6'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100
          hover:shadow-xl transition-shadow duration-300 '>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4 ' />
              <h2>Add Food Item</h2>
              <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                Show yout delicious creations with our customers b adding tem to the menu.
              </p>
              <button className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full
              font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 ' onClick={()=>Navigate("/add-item") }>Add Food</button>
            </div>
          </div>
         
       </div>  }

          


           </div>

            {myShopData.items?.length > 0 && <div className='p-4 sm:p-6 w-full 
                  flex flex-col 
                  gap-6 place-items-center'>
           {myShopData.items.map((item, index) => (
             <OwnerItemCard data={item} key={index} />
            ))}
            </div>
           }

       </div> }
     
       

    </div>
  )
}

export default OwnerDashboad
