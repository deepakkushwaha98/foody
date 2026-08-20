import React from 'react'
import { FaTrash, FaCreditCard, FaShieldAlt } from 'react-icons/fa'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { IoCartOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart, closeCartDrawer, dismissMultipleOrdersBanner, dismissOneOutletBanner, removeCartItem, updateQuantity } from '../redux/userSlice'
import { calculateCartSummary } from '../utils/cartPricing'

const CartQuantityControl = ({ item }) => {
  const dispatch = useDispatch()

  const handleIncrease = () => {
    dispatch(updateQuantity({ id: item.id, quantity: Number(item.quantity) + 1 }))
  }

  const handleDecrease = () => {
    if (Number(item.quantity) > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: Number(item.quantity) - 1 }))
    }
  }

  return (
    <div className='flex items-center gap-2 rounded-full border border-[#f0d6ca] px-2 py-1'>
      <button onClick={handleDecrease} className='text-slate-600'><FaMinus size={10} /></button>
      <span className='w-5 text-center text-sm font-semibold'>{item.quantity}</span>
      <button onClick={handleIncrease} className='text-slate-600'><FaPlus size={10} /></button>
    </div>
  )
}

const CartPanel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems } = useSelector(state => state.user)
  const { cartOutletName, hideMultipleOrdersBanner, hideOneOutletBanner } = useSelector(state => state.user)
  const summary = calculateCartSummary(cartItems)
  const hasItems = cartItems.length > 0

  const handleProceedToCheckout = () => {
    if (!cartItems.length) return
    dispatch(closeCartDrawer())
    navigate('/checkout')
  }

  return (
    <div className='flex h-full flex-col'>
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

      <div className='mt-4 flex-1 overflow-y-auto pr-1 space-y-3'>
        {hasItems ? (
          <>
            {!hideMultipleOrdersBanner && (
              <div className='relative rounded-[1.4rem] border border-[#ffd7c8] bg-[#fff7f2] p-3 pr-10 text-sm text-slate-700'>
                <div className='font-semibold text-slate-900'>Multiple Orders Allowed</div>
                <p className='mt-1 text-xs leading-5 text-slate-500'>You can keep several items from this outlet in one cart before checkout.</p>
                <button
                  type='button'
                  onClick={() => {
                    dispatch(dismissMultipleOrdersBanner())
                    window.localStorage.setItem('hideMultipleOrdersBanner', 'true')
                  }}
                  className='absolute right-3 top-3 text-slate-400 hover:text-slate-700'
                >
                  ×
                </button>
              </div>
            )}

            {!hideOneOutletBanner && (
              <div className='relative rounded-[1.4rem] border border-[#ffd7c8] bg-[#fffaf7] p-3 pr-10 text-sm text-slate-700'>
                <div className='font-semibold text-slate-900'>One Outlet at a Time</div>
                <p className='mt-1 text-xs leading-5 text-slate-500'>This cart stays linked to one outlet so totals and checkout stay accurate.</p>
                <button
                  type='button'
                  onClick={() => {
                    dispatch(dismissOneOutletBanner())
                    window.localStorage.setItem('hideOneOutletBanner', 'true')
                  }}
                  className='absolute right-3 top-3 text-slate-400 hover:text-slate-700'
                >
                  ×
                </button>
              </div>
            )}

            {cartItems.map((item) => (
              <div key={item.id} className='group flex gap-3 rounded-[1.4rem] border border-[#f3ddd3] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
                <img src={item.image} alt={item.name} className='h-16 w-16 rounded-2xl object-cover' />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0'>
                      <h4 className='truncate text-sm font-semibold text-slate-900'>{item.name}</h4>
                      <p className='truncate text-xs text-slate-500'>{item.shopName || cartOutletName}</p>
                    </div>
                    <button onClick={() => dispatch(removeCartItem(item.id))} className='text-slate-400 transition hover:text-red-500'>
                      <FaTrash />
                    </button>
                  </div>
                  <div className='mt-2 flex items-center justify-between gap-3'>
                    <span className='text-sm font-semibold text-[#ff5b34]'>₹ {Number(item.price) * Number(item.quantity)}</span>
                    <CartQuantityControl item={item} />
                  </div>
                </div>
              </div>
            ))}

            <div className='rounded-[1.6rem] border border-[#f1dfd5] bg-[#fffaf7] p-4 shadow-sm'>
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

            <button onClick={handleProceedToCheckout} className='mt-5 w-full rounded-2xl bg-gradient-to-r from-[#ff5b34] to-[#ff7d4a] px-5 py-4 text-base font-bold text-white shadow-[0_18px_45px_rgba(255,93,52,0.28)] transition hover:-translate-y-0.5 hover:from-[#ff6a43] hover:to-[#ff8b5a]'>
            Proceed to Checkout
            </button>
          </>
        ) : (
          <div className='flex h-full min-h-[420px] flex-col'>
            <div className='mt-8 flex flex-1 flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-[#ffd4c5] bg-[#fff7f2] p-6 text-center'>
              <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#ffd9cb] bg-white text-[#ff5b34] shadow-sm'>
                <IoCartOutline size={34} />
              </div>
              <h4 className='text-lg font-bold text-slate-900'>Your cart is empty</h4>
              <p className='mt-2 max-w-[230px] text-sm leading-6 text-slate-500'>Add items from the menu to continue.</p>
              <button
                type='button'
                onClick={() => {
                  dispatch(closeCartDrawer())
                  navigate('/')
                }}
                className='mt-6 w-full max-w-[240px] rounded-2xl bg-[#ff5b34] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,91,52,0.30)] transition hover:bg-[#eb4a29]'
              >
                View Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPanel