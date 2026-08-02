import React, { useState } from 'react'
import { FaLeaf, FaDrumstickBite, FaStar, FaCartPlus } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux"
import { addToCart, clearCart } from '../redux/userSlice';

const FoodCard = ({ data, shopId, shopName }) => {
  const dispatch = useDispatch();
  const { cartItems, cartOutletId } = useSelector(state => state.user)
  const [quantity, setQuantity] = useState(0)
  const [showOutletModal, setShowOutletModal] = useState(false)
  const [message, setMessage] = useState(null)

  if (!data) return null;

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className='text-yellow-500 text-lg' />
        ) : (
          <IoIosStarOutline key={i} className='text-yellow-500 text-lg' />
        )
      )
    }
    return stars
  }

  const handleIncrease = () => setQuantity((value) => value + 1)
  const handleDecrease = () => setQuantity((value) => Math.max(0, value - 1))

  const resolvedOutletId = shopId || data.shop?._id || data.shop || null
  const resolvedOutletName = shopName || data.shop?.name || data.shopName || 'this outlet'
  const isInCart = cartItems.some(i => i.id === data._id)

  const clearMessage = () => {
    setMessage(null)
    window.setTimeout(() => setMessage(null), 3000)
  }

  const handleAddToCart = () => {
    if (quantity <= 0) {
      setMessage('Please select at least 1 item.')
      return
    }

    const currentOutletId = cartOutletId || cartItems[0]?.shopId || cartItems[0]?.shop?._id || cartItems[0]?.shop || null
    if (currentOutletId && resolvedOutletId && String(currentOutletId) !== String(resolvedOutletId)) {
      setShowOutletModal(true)
      return
    }

    dispatch(addToCart({
      id: data._id,
      name: data.name,
      price: Number(data.price),
      image: data.image,
      shop: data.shop,
      shopId: resolvedOutletId,
      shopName: resolvedOutletName,
      quantity,
      foodType: data.foodType,
    }))
    setQuantity(0)
    setMessage('Added to cart successfully.')
    clearMessage()
  }

  const handleClearAndContinue = () => {
    dispatch(clearCart())
    dispatch(addToCart({
      id: data._id,
      name: data.name,
      price: Number(data.price),
      image: data.image,
      shop: data.shop,
      shopId: resolvedOutletId,
      shopName: resolvedOutletName,
      quantity,
      foodType: data.foodType,
    }))
    setQuantity(0)
    setShowOutletModal(false)
    setMessage('Added to cart successfully.')
    clearMessage()
  }

  return (
    <>
      <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col'>
        <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>
          <div className='absolute top-3 right-3 bg-white rounded-full p-1 shadow '>
            {data.foodType === 'veg' ? <FaLeaf className='text-green-600 text-lg' /> : <FaDrumstickBite className='text-red-600 ' />}
          </div>

          <img src={data.image} alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' />
        </div>

        <div className='flex-1 flex-col p-4'>
          <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>
          <div className='flex items-center gap-1 mt-1'>
            {renderStars(data.rating?.average || 0)}
            <span>{data.rating?.count || 0}</span>
          </div>

          {data.description && (
            <p className='mt-2 text-sm text-gray-600 line-clamp-3'>
              {data.description}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between mt-auto p-4'>
          <span className='font-bold text-gray-900 text-lg'>
            {data.price}
          </span>

          <div className='flex items-center rounded-full overflow-hidden shadow-sm border border-[#f1f1f1]'>
            <button className='px-3 pt-1 hover:bg-gray-100 transition' onClick={handleDecrease}>
              <FaMinus size={14} />
            </button>

            <span className='min-w-[2rem] text-center text-sm font-semibold'>{quantity}</span>

            <button className='px-3 pt-1 hover:bg-gray-100 transition' onClick={handleIncrease}>
              <FaPlus size={14} />
            </button>

            <button className={`${isInCart ? "bg-[#2aa56c]" : "bg-[#ff4d2d]"} text-white px-4 py-2 transition-colors`} onClick={handleAddToCart}>
              <FaCartPlus size={16} />
            </button>
          </div>
        </div>
      </div>

      {message ? (
        <div className='fixed bottom-6 right-6 z-50 rounded-2xl border border-[#d1e7dd] bg-[#d1e7dd] px-4 py-3 text-sm font-medium text-[#0f5132] shadow-[0_18px_50px_rgba(0,0,0,0.14)]'>
          {message}
        </div>
      ) : null}

      {showOutletModal ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4'>
          <div className='w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]'>
            <h3 className='text-lg font-bold text-slate-900'>Different outlet detected</h3>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              You already have items from {cartItems[0]?.shopName || 'another outlet'} in your cart. Please complete or clear your current cart before ordering from {resolvedOutletName}.
            </p>
            <div className='mt-5 flex gap-3'>
              <button type='button' onClick={() => setShowOutletModal(false)} className='flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'>
                Cancel
              </button>
              <button type='button' onClick={handleClearAndContinue} className='flex-1 rounded-2xl bg-[#ff4d2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e64526]'>
                Clear Cart & Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default FoodCard