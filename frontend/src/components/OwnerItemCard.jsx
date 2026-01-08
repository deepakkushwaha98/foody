import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const OwnerItemCard = ({ data }) => {
    const navigate = useNavigate()
  return (
    
        <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl ' >
            
            <div className='w-36 self-stretch  flex-shrink-0 bg-gray-50'>
                <img src={data?.image} alt="" className='w-full h-full object-cover' />   
             </div>
             <div className='flex flex-col justify-center p-3 flex-1 '>
                <div className=''>
                <h2 className='text-base font-semibold  '>name: <span>{data?.name}</span></h2>
             <p className='font-medium text-gray-700 '>Category: <span>{data?.category}</span> </p>
                <p className='font-medium text-gray-700 '>Food Type: <span>{data?.foodType}</span> </p>

                </div>
   
                
                <div className='flex items-center justify-between'>
                    <div className=''>price: <span>{data?.price}</span> </div>

                    <div className='flex items-center gap-2 cursor-pointer' >
                        <div className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={() => navigate(`/edit-item/${data?._id}`)}>
                             <FaPen size={16}/>

                        </div>
                        <div className='p-2 rounded-full cursor-pointer hover:bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={() => {}}>
                            <FaTrash size={16}/>

                        </div>
                    </div>

                </div>

             </div>
        </div>


  )
}

export default OwnerItemCard
