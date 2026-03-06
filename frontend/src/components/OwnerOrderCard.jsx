import React from 'react'
import axios from 'axios'
import { FaPhoneAlt } from "react-icons/fa";
import {serverUrl} from "../App"
import { updateOrderStatus } from '../redux/userSlice';
import { useDispatch } from "react-redux";
import { useState } from 'react';


const OwnerOrderCard = ({data}) => {
  const dispatch = useDispatch();

  const [availableBoys , setAvailableBoys] = useState([]);

  const handleUpdateStatus = async (orderId , shopId , status)=>{
    try{
      const result = await axios.put(`${serverUrl}/api/order/update-status/${orderId}/${shopId}` , {status} , {withCredentials:true})
      dispatch(updateOrderStatus({orderId , shopId , status}))
      setAvailableBoys(result.data.availableBoys);
      console.log("result data", result.data);
    }
    catch(err){
      console.log(err);

    }

  }
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
      <div>
        <h2 className='text-lg font-semibold'>{data.user.fullName}</h2>
        <p className='text-sm text-gray-500'>{data.user.email} </p>
        <p className='flex items-center gap-2 text-sm'><span><FaPhoneAlt /> </span>{data.user.mobile}</p>


      </div>
      
      <div className='flex items-start gap-2 flex-col text-gray-600 text-sm'>
        <p>{data?.deliveryAddress?.text}</p>
        <p className='text-xs text-gray-500'>Lat: {data?.deliveryAddress?.latitude}, Lon: {data?.deliveryAddress?.longitude} </p>
      </div>

       <div className='flex space-x-4 overflow-x-auto pb-2'>
           {data?.shopOrders?.shopOrderItem ? data.shopOrders.shopOrderItem.map((item , index)=>(
            <div key={index} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white '>
              <img src={item.item?.image || item.image} alt={item.item?.name || item.name}  className='w-full h-24 object-cover rounded' />

              <p className='text-sm'>{item.item?.name || item.name}</p>
              <p className='text-xs text-gray-500' >Qty :{item.quantity}X ₹{item.price}</p>
            </div>

           )) : <p className='text-gray-500 text-sm'>No items</p>}


        </div>
      
      <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
        <span className='text-sm'>status: <span className='font-semibold capitalize text-[#ff4d2d]'>{data?.shopOrders?.status || 'pending'}</span></span>

        <select name="" onChange={(e)=>handleUpdateStatus(data._id , data?.shopOrders?.shop?._id , e.target.value)}  id="" className='rounded-md border px-1
        text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d] '>
          <option value="">Change</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out Of Delivery</option>
        </select>
      </div>

      {data?.shopOrders?.status === "out of delivery" &&
       <div className ="mt-4 p-2 border rounded-lg text-sm bg-orange-50">
         {data?.shopOrders?.assignedDeliveryBoy ? <p>Assigned Delivery Boy:</p> : <p>Available Delivery Boys</p>}
         {availableBoys.length>0?(
          availableBoys.map((b,index)=>(
            <div key={b.id} className='text-gray-300'>{b.fullName} - {b.mobile} </div>
          ))
         ): data?.shopOrders?.assignedDeliveryBoy?<div>{data?.shopOrders?.assignedDeliveryBoy.fullName} </div> :<div>waiting for available delivery boys to accept </div> }
      </div> }

      <div className='text-right font-bold text-gray-800 text-sm'>
        Total: ₹{data?.shopOrders?.subtotal || 0}
      </div>

      
    </div>
  )
}

export default OwnerOrderCard
