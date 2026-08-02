import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../../App';
import { useEffect , useState } from 'react';
import { FaLocationArrow } from "react-icons/fa6";
import { FaStore } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import FoodCard from '../../components/FoodCard';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeCartItem, updateQuantity } from '../../redux/userSlice';
import { FaTrash, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import { FaMinus, FaPlus } from 'react-icons/fa6';
const Shop = () => {
    const navigate = useNavigate()
    const {shopId} = useParams()
    const dispatch = useDispatch()
    const [items , setItems] = useState([])
    const [shop, setShop] = useState({})
    const {cartItems, cartOutletName} = useSelector(state => state.user)

    useEffect(() => {
        let cancelled = false

        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}` , {withCredentials:true})
                if (cancelled) return
                setShop(result.data.shop)
                setItems(result.data.items)
            } catch (err) {
                console.log(err)
            }
        }

        fetchShop()

        return () => {
            cancelled = true
        }
    }, [shopId])

        const summary = useMemo(() => {
            const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
            const platformFee = subtotal > 0 ? 8 : 0
            const packagingCharges = subtotal > 0 ? Math.max(20, Math.round(subtotal * 0.015)) : 0
            const gst = Math.round(subtotal * 0.05)
            const deliveryCharges = subtotal > 500 ? 0 : 40
            const discount = 0
            const total = Math.max(0, subtotal + platformFee + packagingCharges + gst + deliveryCharges - discount)
            return { subtotal, platformFee, packagingCharges, gst, deliveryCharges, discount, total }
        }, [cartItems])

        const handleProceedToCheckout = () => {
            if (!cartItems.length) return
            navigate('/checkout')
        }

        const handleIncrease = (item) => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
        const handleDecrease = (item) => {
            if (item.quantity > 1) dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
        }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,243,238,0.95),_rgba(255,249,246,0.98)_42%,_#fff9f6_100%)]'>
        <button className='absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow-sm transition ' onClick={()=>navigate("/")}>
        <FaArrowAltCircleLeft  />
        </button>
        {shop && <div className='relative w-full h-64 md:h-80 lg:h-96'>
            <img src={shop.image} alt="Shop" className="w-full h-full object-cover" />
            <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-blue-30 flex flex-col justify-center items-center text-center px-4'>
               <FaStore className='text-white text-4xl mb-3 drop-shadow-md'/>
               <h1 className='text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg'>{shop.name}</h1>
               <div className='flex items-center gap-[10px]'>
                <FaLocationArrow size={22} color='red' />
               </div>
               <p className='text-lg font-medium text-gray-400 mt-[10px]'>{shop.address} </p>

            </div>

        </div> }
                <div className='mx-auto max-w-[1680px] px-4 py-10 sm:px-6 lg:px-8'>
                    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start'>
                        <main className='min-w-0'>
                            <h2 className='flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800'>
                                    <FaUtensils color='red'/>
                                    Our Menu
                            </h2>

                            {items && items.length > 0 ? (
                                    <div className='flex flex-wrap justify-center gap-6'>
                                            {items.map((item) => (
                                                    <FoodCard key={item._id || item.id} data={item} shopId={shopId} shopName={shop?.name} />
                                            ))}
                                    </div>
                            ): <p className='text-center text-gray-500'>No items available</p> }
                        </main>

                        <aside className='sticky top-5 hidden h-[calc(100vh-2.5rem)] overflow-y-hidden rounded-[2rem] border border-[#ffd7c8] bg-white/85 p-4 shadow-[0_24px_70px_rgba(255,124,77,0.12)] backdrop-blur lg:block hover:overflow-y-auto'>
                            <div className='flex items-center justify-between border-b border-[#ffe2d7] pb-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#ff5b34]'>
                                        <FaCreditCard />
                                    </div>
                                    <div>
                                        <h3 className='text-lg font-bold text-slate-900'>Your Cart</h3>
                                        <p className='text-sm text-slate-500'>{cartItems.length} items</p>
                                    </div>
                                </div>
                                <button onClick={() => dispatch(clearCart())} className='text-sm font-semibold text-[#ff5b34] hover:text-[#e64726]'>Clear Cart</button>
                            </div>

                            <div className='mt-4 space-y-3'>
                                {cartItems.length > 0 ? cartItems.map((item) => (
                                    <div key={item.id} className='group flex gap-3 rounded-[1.4rem] border border-[#f3ddd3] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
                                        <img src={item.image} alt={item.name} className='h-16 w-16 rounded-2xl object-cover' />
                                        <div className='min-w-0 flex-1'>
                                            <div className='flex items-start justify-between gap-2'>
                                                <div className='min-w-0'>
                                                    <h4 className='truncate text-sm font-semibold text-slate-900'>{item.name}</h4>
                                                    <p className='truncate text-xs text-slate-500'>{item.shopName || cartOutletName || shop?.name}</p>
                                                </div>
                                                <button onClick={() => dispatch(removeCartItem(item.id))} className='text-slate-400 transition hover:text-red-500'>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <div className='mt-2 flex items-center justify-between'>
                                                <span className='text-sm font-semibold text-[#ff5b34]'>₹ {Number(item.price) * Number(item.quantity)}</span>
                                                <div className='flex items-center gap-2 rounded-full border border-[#f0d6ca] px-2 py-1'>
                                                    <button onClick={() => handleDecrease(item)} className='text-slate-600'><FaMinus size={10} /></button>
                                                    <span className='w-5 text-center text-sm font-semibold'>{item.quantity}</span>
                                                    <button onClick={() => handleIncrease(item)} className='text-slate-600'><FaPlus size={10} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className='rounded-[1.6rem] border border-dashed border-[#ffd4c5] bg-[#fff7f2] p-6 text-center text-sm text-slate-500'>
                                        Your cart is empty. Add items from this outlet to continue.
                                    </div>
                                )}
                            </div>

                            <div className='mt-5 rounded-[1.6rem] border border-[#f1dfd5] bg-[#fffaf7] p-4 shadow-sm'>
                                <h4 className='mb-4 text-base font-bold text-slate-900'>Order Summary</h4>
                                <div className='space-y-2 text-sm text-slate-600'>
                                    <div className='flex items-center justify-between'><span>Subtotal</span><span>₹ {summary.subtotal}</span></div>
                                    <div className='flex items-center justify-between'><span>Platform Fee</span><span>₹ {summary.platformFee}</span></div>
                                    <div className='flex items-center justify-between'><span>Packaging Charges</span><span>₹ {summary.packagingCharges}</span></div>
                                    <div className='flex items-center justify-between'><span>GST / Taxes</span><span>₹ {summary.gst}</span></div>
                                    <div className='flex items-center justify-between'><span>Delivery Charges</span><span>{summary.deliveryCharges === 0 ? 'Free' : `₹ ${summary.deliveryCharges}`}</span></div>
                                </div>
                                <div className='mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm'>
                                    <span className='text-sm font-semibold text-slate-700'>Total Amount</span>
                                    <span className='text-xl font-bold text-[#ff5b34]'>₹ {summary.total}</span>
                                </div>
                            </div>

                            <div className='mt-4 rounded-[1.6rem] border border-[#f1dfd5] bg-white p-4 shadow-sm'>
                                <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'><FaShieldAlt className='text-[#ff5b34]' /> 100% Secure Payments</div>
                                <p className='mt-2 text-xs leading-6 text-slate-500'>Cash on delivery is supported with secure checkout styling and a clear order summary.</p>
                            </div>

                            <button disabled={!cartItems.length} onClick={handleProceedToCheckout} className='mt-5 w-full rounded-2xl bg-gradient-to-r from-[#ff5b34] to-[#ff7d4a] px-5 py-4 text-base font-bold text-white shadow-[0_18px_45px_rgba(255,93,52,0.28)] transition hover:-translate-y-0.5 hover:from-[#ff6a43] hover:to-[#ff8b5a] disabled:cursor-not-allowed disabled:opacity-50'>
                                Proceed to Checkout
                            </button>
                        </aside>
                    </div>
        </div>
      
    </div>
  )
}

export default Shop
