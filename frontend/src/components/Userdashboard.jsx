import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { useNavigate } from 'react-router-dom'
import { Categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { serverUrl } from '../App'
import CartPanel from './CartPanel';
const Userdashboard = () => {
  const cateScrollRef = useRef()
  const navigate = useNavigate()
  const shopScrollRef = useRef()
   
  const {currentCity , shopInMyCity , itemsInMyCity , searchItems} = useSelector(state => state.user)
  const [showLeftCateButton , setShowLeftCateButton] = useState(false)
  const [showRightCateButton , setShowRightCateButton] = useState(false)
  const [updatedItemList , setUpdatedItemList] = useState(itemsInMyCity || [])
  const [showLeftShopButton , setShowLeftShopButton] = useState(false)
  const [showRightShopButton , setShowRightShopButton] = useState(false)
  
  useEffect(()=>{
    if(itemsInMyCity && itemsInMyCity.length > 0){
      setUpdatedItemList(itemsInMyCity)
    }
  }, [itemsInMyCity])

  const handleFilterByCategory = (category)=>{
    if(category === "all"){
      setUpdatedItemList(itemsInMyCity)
    }
    else{
      const filtered = itemsInMyCity?.filter(i=> i.category === category)
      setUpdatedItemList(filtered)
    }
  }
  
  const updateButton = (ref , setLeftButton , setRightButton)=>{
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft>0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth )
      console.log("left" ,element.scrollLeft)
      console.log("scrollwidth", element.scrollWidth)
      console.log("client" , element.clientWidth)
    }
    }

  

  useEffect(()=>{
    const element = cateScrollRef.current
    const shopElement = shopScrollRef.current
    const onScroll = ()=> updateButton(cateScrollRef , setShowLeftCateButton , setShowRightCateButton)

    if(element){
      updateButton(cateScrollRef , setShowLeftCateButton , setShowRightCateButton)
      element.addEventListener('scroll', onScroll)
      if(shopElement) shopElement.addEventListener('scroll' ,()=> {
        updateButton(shopScrollRef , setShowLeftShopButton , setShowRightShopButton)})
    }

    return ()=>{
      if(element) element.removeEventListener('scroll', onScroll)
      if(shopElement)  { shopElement.removeEventListener('scroll', ()=>{
        updateButton(shopScrollRef , setShowLeftShopButton , setShowRightShopButton)
      }
      )}
    }
  }, [])

  const scrollHandler = (ref,direction)=>{
     if(ref.current){
      ref.current.scrollBy({
        left:direction =="left"?-200:200,
        behavior:"smooth"
      })

     }
  }

 

  return (
     <div>
         <Nav/>

         {searchItems && searchItems.length > 0 && (
          <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
            <h1 className='text-gray-900 text-2xl  sm:text-3xl font-semibold border-b border-gray-200 pb-2 '>Search Result</h1>
             <div className='w-full auto flex flex-wrap gap-6 justify-center'>
              {searchItems.map((item)=>(
                <FoodCard key={item._id} data={item} />
              ))}
             </div>
          </div>
         )}

         <div className='w-full max-w-6xl flex flex-col  gap-5 px-12 items-center p-[10px] '>
           <h1 className='text-gray-800 text-2xl items-start  sm:text-3xl'>Inspiration for you first order</h1>

           <div className='w-full relative'>
          { showLeftCateButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#ff4d2d] text-white p-2
             rounded-full shadow-lg hover:bg-[#e64528] '  onClick={()=> scrollHandler(cateScrollRef ,"left")}>
              <FaAnglesLeft  />

             </button> }
             <div className='w-full flex items-center px-12 overflow-x-auto gap-4 pb-2 ' ref={cateScrollRef}>
               {Categories.map((cate , idx)=>(
              <CategoryCard name={cate.category} image={cate.image} key={idx} onClick={()=>handleFilterByCategory(cate.category)} />
              
           ) )}
             </div>

             {showRightCateButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2
             rounded-full shadow-lg hover:bg-[#e64528] ' onClick={()=> scrollHandler(cateScrollRef ,"right")}>
              <FaAnglesRight />

             </button>}
             

           </div>

         </div>

         <div className='w-full max-w-6xl flex flex-col  gap-5 px-12 items-center p-[10px] ' >
           <h1 className='text-gray-800 text-2xl items-start  sm:text-3xl'>Best Show in your City {currentCity} </h1>

             <div className='w-full relative'>
          { showLeftShopButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#ff4d2d] text-white p-2
             rounded-full shadow-lg hover:bg-[#e64528] '  onClick={()=> scrollHandler(shopScrollRef ,"left")}>
              <FaAnglesLeft  />

             </button> }
             <div className='w-full flex items-center px-12 overflow-x-auto gap-4 pb-2 ' ref={shopScrollRef}>
               {shopInMyCity && shopInMyCity.length > 0 && shopInMyCity.map((shop, idx) => (
              <CategoryCard name={shop.name} image={shop.image} key={idx} onClick={()=>navigate(`/shop/${shop._id}`)} />
              
           ))}
             </div>

             {showRightShopButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2
             rounded-full shadow-lg hover:bg-[#e64528] ' onClick={()=> scrollHandler(shopScrollRef ,"right")}>
              <FaAnglesRight />

             </button>}
             

           </div>

         </div>

          <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:pr-[420px]'>
            <main className='min-w-0'>
                <div className='flex flex-col gap-5 items-center p-[10px]'>
                  <h1 className='text-gray-800 text-2xl items-start sm:text-3xl'> Suggested Food Items</h1>

                  <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
                    {updatedItemList && updatedItemList.length > 0 && updatedItemList.map((item , idx)=>(
                      <FoodCard key={idx} data={item} />
                    ))}
                  </div>
                </div>
            </main>
          </div>

          <div className='fixed right-6 top-20 z-30 hidden h-[calc(100vh-6rem)] w-[380px] overflow-hidden rounded-[2rem] border border-[#ffd7c8] bg-white/95 p-4 shadow-[0_24px_70px_rgba(255,124,77,0.12)] backdrop-blur lg:block'>
            <CartPanel />
          </div>
     </div>
  )
}

export default Userdashboard
