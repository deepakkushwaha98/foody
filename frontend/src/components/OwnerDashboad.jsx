import React, { useEffect, useMemo, useRef, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { FaPen } from "react-icons/fa";
import { FaFireFlameCurved, FaArrowTrendUp, FaChartLine } from "react-icons/fa6";
import OwnerItemCard from './OwnerItemCard'
import axios from 'axios'
import { serverUrl } from '../App'
const emptyArray = []

const SidebarItem = ({ item, rank, variant, onClick }) => {
  const count = variant === 'trending' ? item.recentOrders : item.totalOrders
  const badgeLabel = variant === 'trending' ? `${count} live orders` : `${count} orders`

  return (
    <button type='button' onClick={onClick} className='group flex w-full items-center gap-4 rounded-[1.6rem] border border-[#ffd7c8] bg-white/75 p-3 text-left shadow-[0_18px_45px_rgba(255,127,77,0.10)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ffbea9] hover:shadow-[0_24px_60px_rgba(255,127,77,0.16)]'>
      <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#ffd6c9] bg-[#fff3ee]'>
        {item?.image ? (
          <img src={item.image} alt={item.name} className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffb493] to-[#ff6f45] text-sm font-semibold text-white'>
            {rank}
          </div>
        )}
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <h3 className='truncate text-sm font-semibold text-slate-900'>{item?.name || 'Untitled item'}</h3>
            <p className='truncate text-xs text-slate-500'>{item?.category || 'Uncategorized'}</p>
          </div>
          <span className='shrink-0 rounded-full bg-[#ff5b34] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm'>
            {badgeLabel}
          </span>
        </div>

        {variant === 'trending' ? (
          <div className='mt-2 flex items-center gap-2 text-xs font-medium text-[#ff6f45]'>
            <FaArrowTrendUp />
            <span>Trending right now</span>
          </div>
        ) : null}
      </div>
    </button>
  )
}

const SidebarShell = ({ title, subtitle, icon, children, accentClass, emptyState, showEmptyState }) => (
  <aside className={`sticky top-5 hidden h-[calc(100vh-6.5rem)] overflow-y-hidden rounded-[2rem] border border-[#ffd7c8] bg-gradient-to-b ${accentClass} p-4 shadow-[0_24px_70px_rgba(255,124,77,0.12)] transition-[overflow] duration-300 hover:overflow-y-auto xl:block`}>
    <div className='mb-4 flex items-start gap-3'>
      <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e9] text-[#ff5b34] shadow-inner'>
        {icon}
      </div>
      <div>
        <h2 className='text-lg font-bold text-slate-900'>{title}</h2>
        <p className='mt-1 text-sm leading-6 text-slate-600'>{subtitle}</p>
      </div>
    </div>

    <div className='space-y-3'>
      {children}
      {showEmptyState || (!children?.length ? emptyState : null) ? emptyState : null}
    </div>
  </aside>
)

const OwnerDashboad = () => {
 
   const Navigate = useNavigate()

  const myShopData = useSelector(state => state.owner?.myShopData)
  const userOrders = useSelector(state => state.user?.myOrders)
  const myOrders = Array.isArray(userOrders) ? userOrders : emptyArray
  const [currentTime] = useState(() => Date.now())
  const [mostOrderedItems, setMostOrderedItems] = useState([])
  const [toastMessage, setToastMessage] = useState('')
  const [selectedItemId, setSelectedItemId] = useState(null)
  const itemCardsRef = useRef({})

  useEffect(() => {
    if (!toastMessage) return undefined

    const timeoutId = setTimeout(() => setToastMessage(''), 3000)
    return () => clearTimeout(timeoutId)
  }, [toastMessage])

  useEffect(() => {
    if (!myShopData?._id || !myShopData?.items?.length) return

    const fetchMostOrdered = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/orders/most-ordered`, { withCredentials: true })
        setMostOrderedItems(Array.isArray(result.data) ? result.data : [])
      } catch (err) {
        console.error('get-most-ordered error', err)
        setMostOrderedItems([])
      }
    }

    fetchMostOrdered()
  }, [myShopData?._id, myShopData?.items?.length, myOrders.length])

  const itemInsights = useMemo(() => {
    const recentWindowMs = 60 * 60 * 1000
    const now = currentTime

    const aggregated = new Map()

    myOrders.forEach((order) => {
      const orderTime = new Date(order?.createdAt || 0).getTime()
      const isRecent = Number.isFinite(orderTime) && now - orderTime <= recentWindowMs
      const shopOrderItems = order?.shopOrders?.shopOrderItem || []

      shopOrderItems.forEach((orderItem) => {
        const itemId = String(orderItem?.item?._id || orderItem?.item || orderItem?.name || '')
        if (!itemId) return

        if (!aggregated.has(itemId)) {
          aggregated.set(itemId, {
            id: itemId,
            name: orderItem?.name || 'Untitled item',
            category: orderItem?.category || 'Uncategorized',
            image: orderItem?.image || '',
            totalOrders: 0,
            recentOrders: 0,
          })
        }

        const entry = aggregated.get(itemId)
        const quantity = Number(orderItem?.quantity || 0)

        entry.totalOrders += quantity > 0 ? quantity : 1
        if (isRecent) {
          entry.recentOrders += quantity > 0 ? quantity : 1
        }
      })
    })

    const trending = Array.from(aggregated.values())
      .filter((item) => item.recentOrders > 0)
      .sort((a, b) => b.recentOrders - a.recentOrders)
      .slice(0, 6)

    return { trending }
  }, [currentTime, myOrders])

  const mostOrdered = useMemo(() => {
    const shopItems = new Map((myShopData?.items || []).map((item) => [String(item?._id), item]))

    return (mostOrderedItems || [])
      .map((item) => {
        const shopItem = shopItems.get(String(item.foodId))
        return {
          ...item,
          category: shopItem?.category || item.category || 'Uncategorized',
          image: shopItem?.image || item.image || '',
          name: shopItem?.name || item.name || 'Untitled item',
        }
      })
      .slice(0, 5)
  }, [mostOrderedItems, myShopData?.items])

  const handleSidebarItemClick = (item) => {
    const cardId = `owner-item-${item.foodId}`
    const targetCard = itemCardsRef.current?.[cardId] || document.getElementById(cardId)

    if (!targetCard) {
      setToastMessage('This item is no longer available.')
      return
    }

    setSelectedItemId(cardId)
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.history.replaceState(null, '', `#${cardId}`)

    window.setTimeout(() => {
      setSelectedItemId((current) => (current === cardId ? null : current))
    }, 2500)
  }

  const leftSidebarEmptyState = (
    <div className='rounded-[1.6rem] border border-dashed border-[#ffd4c5] bg-white/80 p-5 text-center text-sm text-slate-500'>
      Add more orders to unlock your top-performing dishes.
    </div>
  )

  const rightSidebarEmptyState = (
    <div className='rounded-[1.6rem] border border-dashed border-[#ffd4c5] bg-white/80 p-5 text-center text-sm text-slate-500'>
      No orders in the last 7 days.
    </div>
  )

  return (
    <div className='w-full min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,243,238,0.95),_rgba(255,249,246,0.98)_42%,_#fff9f6_100%)] pb-11'>
       <Nav/>

      {toastMessage ? (
        <div className='fixed right-6 top-6 z-50 rounded-2xl border border-[#ffd0c0] bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_18px_50px_rgba(255,107,66,0.18)]'>
          {toastMessage}
        </div>
      ) : null}

      <div className='mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-6 xl:grid-cols-[minmax(290px,1fr)_minmax(0,3.4fr)_minmax(290px,1fr)]'>
          <SidebarShell
            title='Most Ordered From Your Outlet'
            subtitle="These are your customers' favorite dishes."
            icon={<FaFireFlameCurved className='text-xl' />}
            accentClass='from-white via-[#fff7f2] to-[#fff0e8]'
            emptyState={leftSidebarEmptyState}
          >
            {mostOrdered.length > 0 ? mostOrdered.map((item, index) => (
              <SidebarItem key={`${item.foodId}-${index}`} item={item} rank={index + 1} variant='ordered' onClick={() => handleSidebarItemClick(item)} />
            )) : null}
          </SidebarShell>

          <main className='xl:h-[calc(100vh-6.5rem)] xl:overflow-y-auto xl:px-1'>
            {!myShopData && <div className='flex justify-center items-center p-4  sm:p-6'>
               <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100
               hover:shadow-xl transition-shadow duration-300 '>
                 <div className='flex flex-col items-center text-center'>
                   <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4 ' />
                   <h2>Add your Restaurant</h2>
                   <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                     Join our food dilivery platfom and reacg thousand of hungry customers every day.
                   </p>
                   <button className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full
                   font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 ' onClick={()=>Navigate("/creat-edit-shop") }>Get Started</button>
                 </div>
               </div>
              
            </div> }


            {myShopData && 
            <div className='w-full   flex flex-col items-center gap-6 sm:px-6'>
             <h1 className='text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-4  '>
                <FaUtensils className='text-[#ff4d2d] w-14 h-14 sm:w-20 sm:h-20 mb-4 ' />Welcome to {myShopData.name}</h1>

                <div className='bg-white shadow-xl rounded-xl overflow-hidden border border-orange-100
                hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative '>
                 <div className='absolute top-4 right-4 bg-[#ff4d3d] text-white p-2 rounded-full shadow-md
                 hover:bg-orange-600 transition-colors ' onClick={()=> Navigate("/creat-edit-shop") } >
                   <FaPen size={20} />

                 </div>
                  <img src={myShopData.image} alt={myShopData.name} className='w-full h-48 sm:h-64 object-cover' />
                   <div className='p-4 sm:p-6'>
                 <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>{myShopData.name}</h1>
                 <p className='text-gray-500 '>{myShopData.city} , {myShopData.state} </p>
                 <p className='text-gray-500 '>{myShopData.address} </p>
               
                </div>
                
                {myShopData.items?.length === 0 && <div className='flex justify-center items-center p-4  sm:p-6'>
               <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100
               hover:shadow-xl transition-shadow duration-300 '>
                 <div className='flex flex-col items-center text-center'>
                   <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4 ' />
                   <h2>Add Food Item</h2>
                   <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                     Show yout delicious creations with our customers b adding tem to the menu.
                   </p>
                   <button className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full
                   font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 ' onClick={()=>Navigate("/add-item") }>Add Food</button>
                 </div>
               </div>
              
            </div>  }

               


                </div>

                 {myShopData.items?.length > 0 && <div className='p-4 sm:p-6 w-full 
                       flex flex-col 
                       gap-6 place-items-center'>
                {myShopData.items.map((item, index) => (
                  <OwnerItemCard
                    data={item}
                    key={index}
                    cardId={`owner-item-${item?._id}`}
                    highlighted={selectedItemId === `owner-item-${item?._id}`}
                    cardRef={(node) => {
                      if (!node) return
                      itemCardsRef.current[`owner-item-${item?._id}`] = node
                    }}
                  />
                 ))}
                 </div>
                }

            </div> }
          </main>

          <SidebarShell
            title='Most Ordered in Last 7 Days'
            subtitle='Based on orders from the past 7 days.'
            icon={<FaArrowTrendUp className='text-xl' />}
            accentClass='from-white via-[#fff7f2] to-[#fff0e8]'
            emptyState={rightSidebarEmptyState}
            showEmptyState={mostOrdered.length === 0}
          >
            {mostOrdered.length > 0 ? mostOrdered.map((item, index) => (
              <SidebarItem key={`${item.foodId}-trend-${index}`} item={item} rank={index + 1} variant='ordered' onClick={() => handleSidebarItemClick(item)} />
            )) : null}

            <div className='rounded-[1.6rem] border border-[#ffd4c5] bg-white/80 p-4 shadow-[0_18px_45px_rgba(255,95,54,0.10)] backdrop-blur'>
              <div className='flex items-start gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#ff5b34]'>
                  <FaChartLine />
                </div>
                <div>
                  <h3 className='text-sm font-semibold text-slate-900'>High Orders Today</h3>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>Evening hours are seeing the highest demand.</p>
                </div>
              </div>
            </div>
          </SidebarShell>
        </div>
      </div>

    </div>
  )
}

export default OwnerDashboad
