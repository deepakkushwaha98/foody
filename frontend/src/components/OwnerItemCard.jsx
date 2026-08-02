import axios from 'axios';
import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

const OwnerItemCard = ({ data, highlighted = false, cardId, cardRef }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
     const handleDeleteItem = async() =>{
        try{
            const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}` ,
                {withCredentials:true}
            )
            dispatch(setMyShopData(result.data))

        }
        catch(err){
            console.log(err)

        }
    
   }
  return (
    
          <div
             id={cardId}
             ref={cardRef}
             className={`flex w-full max-w-2xl overflow-hidden rounded-[1.6rem] border bg-white shadow-md transition-all duration-500 ${highlighted ? 'border-[#ff6a43] shadow-[0_0_0_1px_rgba(255,106,67,0.35),0_0_32px_rgba(255,106,67,0.18)] ring-2 ring-[#ffb29a]/60' : 'border-[#ffd4c5]'}`}
          >
            
                <div className='w-36 self-stretch flex-shrink-0 bg-gray-50'>
                <img src={data?.image} alt="" className='w-full h-full object-cover' />   
             </div>
                 <div className='flex flex-1 flex-col justify-center p-4 '>
                <div className=''>
                     <h2 className='text-base font-semibold text-slate-900'>name: <span>{data?.name}</span></h2>
                 <p className='font-medium text-gray-700 '>Category: <span>{data?.category}</span> </p>
                     <p className='font-medium text-gray-700 '>Food Type: <span>{data?.foodType}</span> </p>

                </div>
   
                
                <div className='flex items-center justify-between'>
                    <div className=''>price: <span>{data?.price}</span> </div>

                    <div className='flex items-center gap-2 cursor-pointer' >
                        <div className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={() => navigate(`/edit-item/${data?._id}`)}>
                             <FaPen size={16}/>

                        </div>
                        <div className='p-2 rounded-full cursor-pointer hover:bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={handleDeleteItem}>
                            <FaTrash size={16}/>

                        </div>
                    </div>

                </div>

             </div>
        </div>


  )
}

export default OwnerItemCard
