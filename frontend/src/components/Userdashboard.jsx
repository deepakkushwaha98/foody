import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { Categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
const Userdashboard = () => {
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
   
  const {currentCity , shopInMyCity , itemsInMyCity} = useSelector(state => state.user)
  const [showLeftCateButton , setShowLeftCateButton] = useState(false)
  const [showRightCateButton , setShowRighCateButtom] = useState(false)
   const [showLeftShopButton , setShowLeftShopButton] = useState(false)
  const [showRightShopButton , setShowRighShopButtom] = useState(false)


  
  const updateButton = (ref , setLeftButton , setRighButtom)=>{
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft>0)
      setRighButtom(element.scrollLeft + element.clientWidth < element.scrollWidth )
      console.log("left" ,element.scrollLeft)
      console.log("scrollwidth", element.scrollWidth)
      console.log("client" , element.clientWidth)
    }
    }

  

  useEffect(()=>{
    const element = cateScrollRef.current
    const onScroll = ()=> updateButton(cateScrollRef , setShowLeftCateButton , setShowRighCateButtom)

    if(element){
      updateButton(cateScrollRef , setShowLeftCateButton , setShowRighCateButtom)
      element.addEventListener('scroll', onScroll)
      shopScrollRef.current.addEventListener('scroll' ,()=> {
        updateButton(shopScrollRef , setShowLeftShopButton , setShowRighShopButtom)})
    }

    return ()=>{
      if(element) element.removeEventListener('scroll', onScroll)
      if(shopScrollRef.current)  { shopScrollRef.current.removeEventListener('scroll', ()=>{
        updateButton(shopScrollRef , setShowLeftShopButton , setShowRighShopButtom)
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

         <div className='w-full max-w-6xl flex flex-col  gap-5 px-12 items-center p-[10px] '>
           <h1 className='text-gray-800 text-2xl items-start  sm:text-3xl'>Inspiration for you first order</h1>

           <div className='w-full relative'>
          { showLeftCateButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#ff4d2d] text-white p-2
             rounded-full shadow-lg hover:bg-[#e64528] '  onClick={()=> scrollHandler(cateScrollRef ,"left")}>
              <FaAnglesLeft  />

             </button> }
             <div className='w-full flex items-center px-12 overflow-x-auto gap-4 pb-2 ' ref={cateScrollRef}>
               {Categories.map((cate , idx)=>(
              <CategoryCard name={cate.category} image={cate.image} key={idx}  />
              
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
               {shopInMyCity.map((shop , idx)=>(
              <CategoryCard name={shop.name} image={shop.image} key={idx}  />
              
           ) )}
             </div>

             {showRightShopButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2
             rounded-full shadow-lg hover:bg-[#e64528] ' onClick={()=> scrollHandler(shopScrollRef ,"right")}>
              <FaAnglesRight />

             </button>}
             

           </div>

         </div>

          <div className='w-full max-w-6xl flex flex-col  gap-5 px-12 items-center p-[10px] '>
            <h1 className='text-gray-800 text-2xl items-start  sm:text-3xl'> Suggested Food Items</h1>

            <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
              {itemsInMyCity?.map((item , idx)=>(
                <FoodCard key={idx} data={item} />
              ))}

            </div>

          </div>
     </div>
  )
}

export default Userdashboard
