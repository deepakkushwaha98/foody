import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Categories } from '../category'
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { LuReceipt } from "react-icons/lu";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { serverUrl } from '../App'
import CartPanel from './CartPanel';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCurrentCity, setSearchItems, setUserData } from '../redux/userSlice';

const FALLBACK_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=320&q=80'

const slugifyCategory = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '').trim()

const UserHeader = ({
  userData,
  currentCity,
  cartCount,
  query,
  setQuery,
  cityInput,
  setCityInput,
  editCity,
  setEditCity,
  onApplyCity,
  onOrders,
  onCart,
  onLogOut,
}) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className='sticky top-0 z-40 border-b border-[#f8d8cb] bg-[#fff9f5]/95 backdrop-blur'>
      <div className='mx-auto flex w-full max-w-[1680px] items-center gap-3 px-3 py-3 sm:px-5 lg:px-7'>
        <button type='button' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='flex min-w-fit items-center gap-2'>
          <div className='rounded-2xl bg-[#ff5d38] px-3 py-2 text-lg font-bold leading-none text-white'>TT</div>
          <div className='hidden text-left sm:block'>
            <div className='text-sm font-bold text-slate-900'>TummyTales</div>
            <div className='text-xs text-slate-500'>by Foody</div>
          </div>
        </button>

        <div className='hidden min-w-[160px] items-center gap-2 rounded-2xl border border-[#f6d0c1] bg-white px-3 py-2 md:flex'>
          <FaLocationDot className='text-[#ff5d38]' />
          {editCity ? (
            <input
              type='text'
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onBlur={onApplyCity}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onApplyCity()
                }
              }}
              className='w-full bg-transparent text-sm font-medium text-slate-800 outline-none'
              placeholder='Enter city'
              autoFocus
            />
          ) : (
            <button type='button' onClick={() => setEditCity(true)} className='truncate text-sm font-medium text-slate-700'>
              {currentCity || 'Delhi'}
            </button>
          )}
        </div>

        <div className='flex flex-1 items-center gap-2 rounded-2xl border border-[#f2d2c4] bg-white px-3 py-2 shadow-sm'>
          <IoMdSearch className='shrink-0 text-lg text-[#ff5d38]' />
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for food, restaurants...'
            className='w-full bg-transparent text-sm text-slate-700 outline-none sm:text-base'
          />
        </div>

        <button type='button' onClick={onOrders} className='hidden items-center gap-2 rounded-2xl border border-[#ffd3c3] bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#ffb79f] md:flex'>
          <LuReceipt className='text-[#ff5d38]' />
          Orders
        </button>

        <button type='button' onClick={onCart} className='relative rounded-2xl border border-[#ffd3c3] bg-white p-2.5 text-[#ff5d38] transition hover:border-[#ffb79f]'>
          <IoCartOutline size={20} />
          <span className='absolute -right-1 -top-1 rounded-full bg-[#ff5d38] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white'>{cartCount}</span>
        </button>

        <div className='relative'>
          <button type='button' onClick={() => setShowMenu((v) => !v)} className='flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5d38] text-sm font-bold text-white'>
            {userData?.fullName?.slice(0, 1)?.toUpperCase() || 'U'}
          </button>

          {showMenu ? (
            <div className='absolute right-0 top-12 w-44 rounded-2xl border border-[#f5d5c8] bg-white p-3 shadow-xl'>
              <p className='truncate text-sm font-semibold text-slate-800'>{userData?.fullName || 'User'}</p>
              <button type='button' onClick={onOrders} className='mt-2 w-full rounded-xl bg-[#fff3ed] px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#ffe8de]'>
                My Orders
              </button>
              <button type='button' onClick={onLogOut} className='mt-2 w-full rounded-xl bg-[#ff5d38] px-3 py-2 text-left text-sm font-semibold text-white hover:bg-[#ec4f2b]'>
                Log Out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

const Userdashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const categoryTrackRef = useRef(null)
  const categorySetRef = useRef(null)
  const categoryViewportRef = useRef(null)
  const categoryOffsetRef = useRef(0)
  const categoryWidthRef = useRef(1)
  const animationRef = useRef(null)
  const previousTimeRef = useRef(0)
  const [isCategoryHovered, setIsCategoryHovered] = useState(false)
  const shopScrollRef = useRef(null)
  const [query, setQuery] = useState('')
  const [editCity, setEditCity] = useState(false)
  const [cityInput, setCityInput] = useState('')
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
   
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems, cartItems, userData } = useSelector(state => state.user)
  const [updatedItemList , setUpdatedItemList] = useState(itemsInMyCity || [])

  const categoryImageMap = useMemo(() => {
    return Categories.reduce((acc, entry) => {
      acc[slugifyCategory(entry.category)] = entry.image
      return acc
    }, {})
  }, [])

  const availableCategories = useMemo(() => {
    const fromItems = Array.isArray(itemsInMyCity)
      ? Array.from(new Set(itemsInMyCity.map((item) => item?.category).filter(Boolean)))
      : []

    const categoryFromItemMap = {}
    if (Array.isArray(itemsInMyCity)) {
      itemsInMyCity.forEach((item) => {
        const key = slugifyCategory(item?.category || '')
        if (key && !categoryFromItemMap[key] && item?.image) {
          categoryFromItemMap[key] = item.image
        }
      })
    }

    const merged = [...new Set([...
      Categories.map((entry) => entry.category),
      ...fromItems,
      'Pasta',
      'Drinks',
      'Beverages',
      'Salads',
    ])]

    return merged
      .filter((name) => name && slugifyCategory(name) !== 'all')
      .map((name) => {
        const key = slugifyCategory(name)
        return {
          category: name,
          image: categoryFromItemMap[key] || categoryImageMap[key] || FALLBACK_CATEGORY_IMAGE,
        }
      })
  }, [itemsInMyCity, categoryImageMap])

  const shownItems = searchItems && searchItems.length > 0 ? searchItems : updatedItemList

  useEffect(()=>{
    if(itemsInMyCity && itemsInMyCity.length > 0){
      setUpdatedItemList(itemsInMyCity)
    }
  }, [itemsInMyCity])

  useEffect(() => {
    const debounceTimer = window.setTimeout(async () => {
      if (!query.trim()) {
        dispatch(setSearchItems(null))
        return
      }

      try {
        const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query.trim()}&city=${currentCity}`, { withCredentials: true })
        dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
      }
    }, 250)

    return () => window.clearTimeout(debounceTimer)
  }, [query, currentCity, dispatch])

  useEffect(() => {
    const measureWidth = () => {
      if (!categorySetRef.current) return
      const measuredWidth = categorySetRef.current.getBoundingClientRect().width
      categoryWidthRef.current = measuredWidth > 0 ? measuredWidth : 1
    }

    measureWidth()
    window.addEventListener('resize', measureWidth)

    return () => {
      window.removeEventListener('resize', measureWidth)
    }
  }, [availableCategories.length])

  useEffect(() => {
    const runAnimation = (currentTime) => {
      if (!categoryTrackRef.current || !isCategoryHovered) {
        previousTimeRef.current = currentTime
        animationRef.current = window.requestAnimationFrame(runAnimation)
        return
      }

      const delta = currentTime - (previousTimeRef.current || currentTime)
      previousTimeRef.current = currentTime

      const speedPxPerSecond = 90
      const step = (delta / 1000) * speedPxPerSecond
      const categoryWidth = categoryWidthRef.current || 1

      categoryOffsetRef.current += step
      if (categoryOffsetRef.current >= categoryWidth) {
        categoryOffsetRef.current -= categoryWidth
      }

      categoryTrackRef.current.style.transform = `translate3d(${-categoryOffsetRef.current}px, 0, 0)`
      animationRef.current = window.requestAnimationFrame(runAnimation)
    }

    animationRef.current = window.requestAnimationFrame(runAnimation)

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isCategoryHovered])

  const handleApplyCity = () => {
    if (cityInput.trim()) {
      dispatch(setCurrentCity(cityInput.trim()))
    }
    setEditCity(false)
    setCityInput('')
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilterByCategory = (category)=>{
    if(!category || category.toLowerCase() === 'all'){
      setUpdatedItemList(itemsInMyCity)
    }
    else{
      const filtered = itemsInMyCity?.filter(i => (i.category || '').toLowerCase() === category.toLowerCase())
      setUpdatedItemList(filtered)
    }
  }
  
  const updateButton = (ref , setLeftButton , setRightButton) => {
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft>0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth )
    }
    }

  useEffect(()=>{
    const shopElement = shopScrollRef.current
    const onShopScroll = () => updateButton(shopScrollRef , setShowLeftShopButton , setShowRightShopButton)

    if (shopElement) {
      updateButton(shopScrollRef , setShowLeftShopButton , setShowRightShopButton)
      shopElement.addEventListener('scroll', onShopScroll)
    }

    return ()=>{
      if (shopElement) {
        shopElement.removeEventListener('scroll', onShopScroll)
      }
    }
  }, [shopInMyCity])

  const scrollHandler = (ref,direction)=>{
     if(ref.current){
      ref.current.scrollBy({
        left:direction === 'left' ? -260 : 260,
        behavior:"smooth"
      })

     }
  }

  const nudgeCategoryTrack = (direction) => {
    const width = categoryWidthRef.current || 1
    const step = 190
    if (direction === 'left') {
      categoryOffsetRef.current = Math.max(0, categoryOffsetRef.current - step)
    } else {
      categoryOffsetRef.current += step
    }

    if (categoryOffsetRef.current >= width) {
      categoryOffsetRef.current -= width
    }
    if (categoryOffsetRef.current < 0) {
      categoryOffsetRef.current += width
    }

    if (categoryTrackRef.current) {
      categoryTrackRef.current.style.transform = `translate3d(${-categoryOffsetRef.current}px, 0, 0)`
    }
  }

 

  return (
     <div className='min-h-screen bg-[#fff9f5] text-slate-900 [font-family:Sora,sans-serif]'>
        <UserHeader
          userData={userData}
          currentCity={currentCity}
          cartCount={cartItems.length}
          query={query}
          setQuery={setQuery}
          cityInput={cityInput}
          setCityInput={setCityInput}
          editCity={editCity}
          setEditCity={setEditCity}
          onApplyCity={handleApplyCity}
          onOrders={() => navigate('/my-orders')}
          onCart={() => navigate('/cart')}
          onLogOut={handleLogout}
        />

        <div className='mx-auto grid w-full max-w-[1680px] gap-5 px-3 py-5 sm:px-5 lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)] lg:gap-6 lg:px-7'>
          <main className='min-w-0 space-y-7'>
            <section className='rounded-3xl border border-[#f7d6ca] bg-white p-4 shadow-[0_10px_35px_rgba(44,23,10,0.06)] sm:p-5'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <h2 className='text-xl font-bold text-slate-900 sm:text-2xl'>Inspiration for your first order</h2>
                <div className='flex items-center gap-2'>
                  <button type='button' aria-label='Move categories left' onClick={() => nudgeCategoryTrack('left')} className='rounded-full border border-[#ffd3c3] bg-white p-2 text-[#ff5d38] shadow-sm transition hover:bg-[#fff2ec]'>
                    <FaAnglesLeft />
                  </button>
                  <button type='button' aria-label='Move categories right' onClick={() => nudgeCategoryTrack('right')} className='rounded-full border border-[#ffd3c3] bg-white p-2 text-[#ff5d38] shadow-sm transition hover:bg-[#fff2ec]'>
                    <FaAnglesRight />
                  </button>
                </div>
              </div>

              <div className='sm:hidden overflow-x-auto rounded-2xl border border-[#ffe0d3] bg-[#fffaf8] p-2'>
                <div className='flex w-max items-center gap-4'>
                  {availableCategories.map((cate, idx) => (
                    <button type='button' key={`mobile-${idx}`} onClick={() => handleFilterByCategory(cate.category)} className='group w-[96px] shrink-0 text-center'>
                      <div className='mx-auto h-[78px] w-[78px] overflow-hidden rounded-full border-2 border-[#ffd5c7] bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]'>
                        <img src={cate.image} alt={cate.category} className='h-full w-full object-cover' />
                      </div>
                      <p className='mt-2 truncate text-xs font-semibold text-slate-700'>{cate.category}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={categoryViewportRef}
                className='relative hidden overflow-hidden rounded-2xl border border-[#ffe0d3] bg-[#fffaf8] p-2 sm:block'
                onMouseEnter={() => setIsCategoryHovered(true)}
                onMouseLeave={() => setIsCategoryHovered(false)}
              >
                <div ref={categoryTrackRef} className='flex w-max items-center gap-4 will-change-transform'>
                  <div ref={categorySetRef} className='flex items-center gap-4'>
                    {availableCategories.map((cate, idx) => (
                      <button type='button' key={`base-${idx}`} onClick={() => handleFilterByCategory(cate.category)} className='group w-[112px] shrink-0 text-center'>
                        <div className='mx-auto h-[88px] w-[88px] overflow-hidden rounded-full border-2 border-[#ffd5c7] bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ffad95]'>
                          <img src={cate.image} alt={cate.category} className='h-full w-full object-cover transition duration-300 group-hover:scale-110' />
                        </div>
                        <p className='mt-2 truncate text-xs font-semibold text-slate-700 sm:text-sm'>{cate.category}</p>
                      </button>
                    ))}
                  </div>

                  <div className='flex items-center gap-4'>
                    {availableCategories.map((cate, idx) => (
                      <button type='button' key={`copy-a-${idx}`} onClick={() => handleFilterByCategory(cate.category)} className='group w-[112px] shrink-0 text-center'>
                        <div className='mx-auto h-[88px] w-[88px] overflow-hidden rounded-full border-2 border-[#ffd5c7] bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ffad95]'>
                          <img src={cate.image} alt={cate.category} className='h-full w-full object-cover transition duration-300 group-hover:scale-110' />
                        </div>
                        <p className='mt-2 truncate text-xs font-semibold text-slate-700 sm:text-sm'>{cate.category}</p>
                      </button>
                    ))}
                  </div>

                  <div className='flex items-center gap-4'>
                    {availableCategories.map((cate, idx) => (
                      <button type='button' key={`copy-b-${idx}`} onClick={() => handleFilterByCategory(cate.category)} className='group w-[112px] shrink-0 text-center'>
                        <div className='mx-auto h-[88px] w-[88px] overflow-hidden rounded-full border-2 border-[#ffd5c7] bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ffad95]'>
                          <img src={cate.image} alt={cate.category} className='h-full w-full object-cover transition duration-300 group-hover:scale-110' />
                        </div>
                        <p className='mt-2 truncate text-xs font-semibold text-slate-700 sm:text-sm'>{cate.category}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className='rounded-3xl border border-[#f7d6ca] bg-white p-4 shadow-[0_10px_35px_rgba(44,23,10,0.06)] sm:p-5'>
              <h2 className='mb-4 text-xl font-bold text-slate-900 sm:text-2xl'>Best Show in your City {currentCity || 'Delhi'}</h2>
              <div className='relative'>
                {showLeftShopButton ? (
                  <button type='button' className='absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#ffd3c3] bg-white p-2 text-[#ff5d38] shadow-md' onClick={() => scrollHandler(shopScrollRef, 'left')}>
                    <FaAnglesLeft />
                  </button>
                ) : null}

                <div ref={shopScrollRef} className='flex gap-4 overflow-x-auto pb-2'>
                  {shopInMyCity && shopInMyCity.length > 0 ? shopInMyCity.map((shop) => (
                    <button
                      type='button'
                      key={shop._id}
                      onClick={() => navigate(`/shop/${shop._id}`)}
                      className='group min-w-[235px] max-w-[250px] flex-1 overflow-hidden rounded-2xl border border-[#ffd4c7] bg-white text-left shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#ffb59e]'
                    >
                      <img src={shop.image} alt={shop.name} className='h-36 w-full object-cover transition duration-300 group-hover:scale-105' />
                      <div className='space-y-1 p-3'>
                        <h3 className='truncate text-base font-bold text-slate-900'>{shop.name}</h3>
                        <p className='text-sm text-slate-500'>{shop.city || currentCity || 'Delhi'}</p>
                      </div>
                    </button>
                  )) : (
                    <div className='w-full rounded-2xl border border-dashed border-[#f2cabc] bg-[#fff6f2] p-6 text-sm text-slate-500'>
                      No restaurants available in this city right now.
                    </div>
                  )}
                </div>

                {showRightShopButton ? (
                  <button type='button' className='absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#ffd3c3] bg-white p-2 text-[#ff5d38] shadow-md' onClick={() => scrollHandler(shopScrollRef, 'right')}>
                    <FaAnglesRight />
                  </button>
                ) : null}
              </div>
            </section>

            <section className='rounded-3xl border border-[#f7d6ca] bg-white p-4 shadow-[0_10px_35px_rgba(44,23,10,0.06)] sm:p-5'>
              <h2 className='mb-4 text-xl font-bold text-slate-900 sm:text-2xl'>Suggested Food Items</h2>
              {shownItems && shownItems.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
                  {shownItems.map((item, idx) => (
                    <FoodCard key={item?._id || idx} data={item} />
                  ))}
                </div>
              ) : (
                <div className='rounded-2xl border border-dashed border-[#f2cabc] bg-[#fff6f2] p-8 text-center text-sm text-slate-500'>
                  No food items available for the selected filters.
                </div>
              )}
            </section>
          </main>

          <aside className='hidden lg:block'>
            <div className='sticky top-[86px] h-[calc(100vh-100px)] overflow-hidden rounded-[28px] border border-[#ffd7c8] bg-white p-4 shadow-[0_18px_55px_rgba(255,120,82,0.12)]'>
              <CartPanel />
            </div>
          </aside>
        </div>
     </div>
  )
}

export default Userdashboard
