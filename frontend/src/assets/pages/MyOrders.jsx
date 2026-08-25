import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../../components/UserOrderCard';
import OwnerOrderCard from '../../components/OwnerOrderCard';
import { setMyOrders, updateRealTimeOrderStatus } from '../../redux/userSlice';

const DELIVERY_FEE = 50;

const MyOrders = () => {
  const {userData , myOrders , socket} = useSelector(state=>state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const deliveryOrders = userData?.role === "deliveryBoy" ? myOrders || [] : []
  const { deliveryEarnings } = useSelector(state => state.user)
  const totalEarning = userData?.role === "deliveryBoy" ? deliveryEarnings : deliveryOrders.length * DELIVERY_FEE
   
  useEffect(()=>{
    socket?.on('newOrder' , (data)=>{
      if(data?.shopOrders?.owner && String(data.shopOrders.owner._id) === String(userData?._id)){
        dispatch(setMyOrders([data,...myOrders]))
      }
    })

    
  socket?.on('update-status' , (statusData)=>{
      dispatch(updateRealTimeOrderStatus({
        orderId: statusData.orderId,
        shopId: statusData.shopId,
        status: statusData.status,
        assignedDeliveryBoy: statusData.assignedDeliveryBoy
      }))
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
            <h1 className='text-2xl font-semibold text-start'> My Ordered History</h1>
        </div>

        {userData?.role === "deliveryBoy" && <div className='mb-6 rounded-xl border border-green-200 bg-green-50 p-5'>
          <p className='text-sm font-medium text-green-800'>Total Earnings</p>
          <p className='mt-1 text-3xl font-bold text-green-700'>₹{totalEarning}</p>
          <p className='mt-1 text-sm text-green-700'>{deliveryOrders.length} completed {deliveryOrders.length === 1 ? "delivery" : "deliveries"}</p>
        </div>}

        <div className='space-y-6'>
            {myOrders?.map((order , index)=>(
              userData.role=="user"?(
                <UserOrderCard data={order} key={index} />
              ):
              userData.role=="owner"?(
                <OwnerOrderCard data={order} key={index} />
              ):
              userData.role=="deliveryBoy"?(
                <div className='rounded-lg bg-white p-4 shadow border border-green-100' key={index}>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h2 className='font-semibold'>{order.shopOrder?.shop?.name || "Delivered order"}</h2>
                      <p className='text-sm text-gray-500'>{order.deliveryAddress?.text}</p>
                      <p className='mt-2 text-sm text-gray-600'>Order total: ₹{order.shopOrder?.subtotal || 0}</p>
                    </div>
                    <span className='whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700'>+₹{DELIVERY_FEE}</span>
                  </div>
                  <p className='mt-3 border-t pt-3 text-xs text-gray-400'>Delivered on {new Date(order.shopOrder?.deliveredAt || order.createdAt).toLocaleDateString()}</p>
                </div>
              ):
              null
            ))}

            {userData?.role === "deliveryBoy" && deliveryOrders.length === 0 && <p className='text-center text-gray-500'>No completed deliveries yet.</p>}

        </div>

      </div>
    </div>
  )
}

export default MyOrders
