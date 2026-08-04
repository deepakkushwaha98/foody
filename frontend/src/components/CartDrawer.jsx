import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartPanel from './CartPanel'
import { closeCartDrawer, openCartDrawer } from '../redux/userSlice'
import { calculateCartSummary } from '../utils/cartPricing'

const CartDrawer = () => {
  const dispatch = useDispatch()
  const { isCartDrawerOpen, cartItems } = useSelector(state => state.user)
  const hasItems = cartItems.length > 0
  const totalAmount = calculateCartSummary(cartItems).total

  return (
    <>
      {hasItems && !isCartDrawerOpen && (
        <button
          type='button'
          onClick={() => dispatch(openCartDrawer())}
          className='fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full bg-[#ff4d2d] px-4 py-3 text-white shadow-[0_20px_50px_rgba(255,77,45,0.35)] lg:hidden'
        >
          <div className='flex flex-col items-start leading-tight'>
            <span className='text-xs font-medium'>{cartItems.length} items</span>
            <span className='text-sm font-bold'>₹ {totalAmount}</span>
          </div>
          <span className='rounded-full bg-white/15 px-3 py-1 text-sm font-semibold'>Cart</span>
        </button>
      )}

      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isCartDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div
          className='absolute inset-0 bg-black/45'
          onClick={() => dispatch(closeCartDrawer())}
        />

        <div className={`absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out lg:inset-y-0 lg:right-0 lg:left-auto lg:bottom-auto lg:top-0 lg:h-full lg:w-[380px] lg:max-h-none lg:rounded-l-[2rem] ${isCartDrawerOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}`}> 
          <button
            type='button'
            onClick={() => dispatch(closeCartDrawer())}
            className='absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-2 text-lg font-semibold text-slate-600 shadow-sm hover:text-slate-900'
          >
            ×
          </button>

          <div className='h-full overflow-y-auto p-4 pt-5'>
            <CartPanel />
          </div>
        </div>
      </div>
    </>
  )
}

export default CartDrawer