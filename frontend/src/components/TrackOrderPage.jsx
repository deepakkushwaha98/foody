import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { useSocket } from '../context/SocketContext'

import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import DeliveryBoyTracking from './DeliveryBoyTracking'
const TrackOrderPage = () => {
  const navigate = useNavigate()
  const {orderId} = useParams()
  const { socket } = useSocket()
  const [currentOrder , setCurrentOrder] = useState()
  const [liveLocation , setLiveLocation] = useState({})
  const handleGetOrder = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}` , {withCredentials:true})
      console.log("Order details:", result.data)
      const orderData = result.data?.order ?? result.data
      setCurrentOrder(orderData)

    }
    catch(error){
      console.error("Error fetching order details:", error)

    }
    
  }
   

  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = ({ deliveryBoyId, latitude, longitude }) => {
      setLiveLocation(prev => ({
        ...prev,
        [deliveryBoyId]: {
          lat: latitude,
          lon: longitude
        }
      }))
    }

    socket.on("updateDriverLocation", handleLocationUpdate)

    return () => {
      socket.off("updateDriverLocation", handleLocationUpdate)
    }
  }, [socket])



  useEffect(() => {
    handleGetOrder()
  }, [orderId])

  return (
    <div className='max-w-4xl mx-auto p-4  flex flex-col gap-6 '>
      <div className='relative top-[20px] left-[20px] mb-[10px] ' onClick={()=>navigate("/")}>
        <IoMdArrowBack size={35} className='text-[#ff4d2d] ' />
        <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>

        {currentOrder?.shopOrders?.map((shopOrder , index)=>(
          <div className='bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4' key={index}>
             <div>
              
                <p className='text-lg font-bold mb-2'>{shopOrder.shop.name} </p>
                <p className='font-semibold'><span>Items:</span>{shopOrder.shopOrderItems?.map(i=>i.name).join(", ")} </p>
                <p><span className='font-semibold'>Subtotal: ₹{shopOrder.subTotal}</span></p>
                <p className='mt-6'><span className='font-semibold'>Delivery Address: <span>{currentOrder?.deliveryAddress?.text}</span></span></p>
         
          </div> 
          {shopOrder.status != "delivered"?<>
            
           
            {shopOrder.assignedDeliveryBoy ?<div className='text-sm text-gray-700'>
              <p className='font-semibold'> <span>Delivery Boy Name :</span> {shopOrder.assignedDeliveryBoy.fullName}</p>
              <p className='font-semibold'> <span>Delivery Boy Contact No. :</span> {shopOrder.assignedDeliveryBoy.mobile}</p>
            </div> :
             <p>Delivery Boy is not assigned yet.</p> }
          
          </>: 
          <p className='text-green-600 font-semibold text-lg'>Delivered</p> }
             {shopOrder.assignedDeliveryBoy && shopOrder.status != "delivered" && (() => {
                const trackingData = {
                  deliveryBoyLocation: liveLocation[shopOrder.assignedDeliveryBoy._id] || {
                    
                    lat: shopOrder.assignedDeliveryBoy.location?.coordinates?.[1] ?? null,
                    lon: shopOrder.assignedDeliveryBoy.location?.coordinates?.[0] ?? null
                  },
                  deliveryAddress: {
                    lat: currentOrder?.deliveryAddress?.latitude ?? null,
                    lon: currentOrder?.deliveryAddress?.longitude ?? null
                  }
                };
                const hasCoords = [
                  trackingData.deliveryBoyLocation.lat,
                  trackingData.deliveryBoyLocation.lon,
                  trackingData.deliveryAddress.lat,
                  trackingData.deliveryAddress.lon
                ].every(v => v !== null && v !== undefined);
                if (hasCoords) {
                  return (
                    <div className='h-[400px] w-full rounded-2xl overflow-hidden shadow-md '>
                      <DeliveryBoyTracking data={trackingData} />
                    </div>
                  );
                } else {
                  return <p className='text-center text-gray-500 mt-2'>Location data unavailable</p>;
                }
              })()}
         </div>
        ))}
      </div>
        
      
    </div>
  )
}

export default TrackOrderPage
