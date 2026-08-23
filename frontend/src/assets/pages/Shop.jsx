import React from 'react'
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
import CartPanel from '../../components/CartPanel';

const Shop = () => {
    const navigate = useNavigate()
    const {shopId} = useParams()
    const [items , setItems] = useState([])
    const [shop, setShop] = useState({})

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
                <div className='mx-auto grid max-w-[1680px] gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8'>
                    <main className='min-w-0'>
                            <h2 className='flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800'>
                                    <FaUtensils color='red'/>
                                    Our Menu
                            </h2>

                                {items && items.length > 0 ? (
                                    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                                            {items.map((item) => (
                                                    <FoodCard key={item._id || item.id} data={item} shopId={shopId} shopName={shop?.name} />
                                            ))}
                                    </div>
                            ): <p className='text-center text-gray-500'>No items available</p> }
                    </main>

        <div className='hidden self-start lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)] lg:max-h-[760px] lg:overflow-hidden rounded-[2rem] border border-[#ffd7c8] bg-white/95 p-4 shadow-[0_24px_70px_rgba(255,124,77,0.12)] backdrop-blur'>
            <CartPanel />
        </div>
        </div>
      
    </div>
  )
}

export default Shop
