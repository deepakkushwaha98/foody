import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { IoMdArrowBack } from "react-icons/io";
import { data, useNavigate } from 'react-router-dom';
import UserOrderCard from '../../components/UserOrderCard';
import OwnerOrderCard from '../../components/OwnerOrderCard';
import { useDispatch } from 'react-redux';
import { setMyOrders } from '../../redux/userSlice';
import { updateRealTimeOrderStatus } from '../../redux/userSlice';

const MyOrders = () => {
  const {userData , myOrders , socket} = useSelector(state=>state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
   
  useEffect(()=>{
    socket?.on('newOrder' , (data)=>{
      if(data?.shopOrders?.owner && String(data.shopOrders.owner._id) === String(userData?._id)){
        dispatch(setMyOrders([data,...myOrders]))
      }
    })

    
  socket?.on('update-status' , (statusData)=>{
    if(String(statusData?.userId) === String(userData?._id)){
      dispatch(updateRealTimeOrderStatus({
        orderId: statusData.orderId,
        shopId: statusData.shopId,
        status: statusData.status
      }))
    }
  })

    return ()=>{
      socket?.off("newOrder")
      socket?.off("update-status")
    }
  },[socket, userData, myOrders, dispatch])



  return (
    <div className='w-gull min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-[800px] p-4'>
        <div className='flex items-center gap-[20px] mb-6 '>
            <div className='z-[10] ' onClick={()=>navigate("/")}>
               <IoMdArrowBack size={35} className='text-[#ff4d2d] ' />
           </div>
            <h1 className='text-2xl font-semibold text-start'> My Orders</h1>
        </div>

        <div className='space-y-6'>
            {myOrders?.map((order , index)=>(
              userData.role=="user"?(
                <UserOrderCard data={order} key={index} />
              ):
              userData.role=="owner"?(
                <OwnerOrderCard data={order} key={index} />
              ):
              null
            ))}

        </div>

      </div>
    </div>
  )
}

export default MyOrders
