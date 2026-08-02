import React from 'react'
import { FaCheckCircle, FaDownload, FaRoute, FaReceipt } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
const OrderPlaced = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const order = location.state?.order
  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,243,238,0.95),_rgba(255,249,246,0.98)_42%,_#fff9f6_100%)] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden '>
        <div className='w-full max-w-2xl rounded-[2rem] border border-[#ffd7c8] bg-white p-8 shadow-[0_24px_70px_rgba(255,124,77,0.12)]'>
          <FaCheckCircle className='mx-auto text-green-600 text-6xl mb-4' />
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Payment Successful</h1>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
              Your order has been placed securely and is now being prepared.
          </p>
          <div className='grid gap-3 sm:grid-cols-2 text-left mb-6'>
            <div className='rounded-2xl bg-[#fffaf7] p-4 border border-[#f3ddd3]'>
              <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'><FaReceipt className='text-[#ff5b34]' /> Order ID</div>
              <p className='mt-2 text-sm text-slate-600'>{order?._id || 'Will appear in My Orders'}</p>
            </div>
            <div className='rounded-2xl bg-[#fffaf7] p-4 border border-[#f3ddd3]'>
              <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'><FaRoute className='text-[#ff5b34]' /> Estimated Delivery</div>
              <p className='mt-2 text-sm text-slate-600'>30 - 45 minutes</p>
            </div>
            <div className='rounded-2xl bg-[#fffaf7] p-4 border border-[#f3ddd3]'>
              <div className='text-sm font-semibold text-slate-900'>Items Ordered</div>
              <p className='mt-2 text-sm text-slate-600'>{order?.shopOrders?.[0]?.shopOrderItem?.length || order?.shopOrders?.shopOrderItem?.length || 0} items</p>
            </div>
            <div className='rounded-2xl bg-[#fffaf7] p-4 border border-[#f3ddd3]'>
              <div className='text-sm font-semibold text-slate-900'>Total Paid</div>
              <p className='mt-2 text-sm text-slate-600'>₹ {order?.totalAmount || '0'}</p>
            </div>
          </div>
          <div className='mb-6 rounded-2xl bg-[#fffaf7] p-4 border border-[#f3ddd3] text-left'>
            <div className='text-sm font-semibold text-slate-900'>Payment Method</div>
            <p className='mt-2 text-sm text-slate-600'>{(order?.paymentMethod || 'cod').toUpperCase()}</p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <button className='bg-[#ff4d2d] hover:bg-[#e74728] text-white px-6 py-3 rounded-xl text-lg font-medium transition flex items-center justify-center gap-2' onClick={()=>navigate("/my-orders")}>
                Track Order
           </button>
           <button className='bg-white hover:bg-gray-50 text-slate-800 px-6 py-3 rounded-xl text-lg font-medium transition border border-gray-200 flex items-center justify-center gap-2' onClick={()=>window.print()}>
                <FaDownload /> Download Invoice
           </button>
          </div>
          <button className='mt-4 text-sm font-semibold text-[#ff5b34]' onClick={()=>navigate("/")}>
            Continue Shopping
          </button>
        </div>
    </div>
  )
}

export default OrderPlaced
