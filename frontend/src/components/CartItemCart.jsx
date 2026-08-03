import React, { useEffect, useState } from 'react'
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { updateQuantity , removeCartItem } from '../redux/userSlice';
const CartItemCart = ({data}) => {
    const dispatch = useDispatch()
        const [quantityInput, setQuantityInput] = useState(String(data.quantity ?? 1))

        useEffect(() => {
            setQuantityInput(String(data.quantity ?? 1))
        }, [data.quantity])

    const handleIncrease=(id , currentQty)=>{
     dispatch(updateQuantity({id , quantity:currentQty+1}))

   }
   const handleDecrease =(id , currentQty)=>{
    if(currentQty>1){
         dispatch(updateQuantity({id , quantity:currentQty-1}))

    }
    

   }

     const handleQuantityChange = (id, value) => {
        setQuantityInput(value)

        if (value === "") {
            return
        }

        const parsedQuantity = parseInt(value, 10)
        if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
            return
        }

        const clampedQuantity = Math.min(99, Math.max(1, parsedQuantity))
        dispatch(updateQuantity({ id, quantity: clampedQuantity }))
     }

  return (
    <div className='flex items-center justify-between bg-white rounded-xl
    shadow border'>
        <div className='flex items-center gap-4'>
            <img src={data.image} alt="" className='w-20 h-20 object-cover rounded-lg
            border' />
            <div className='flex items-center gap-4'>
                <h1 className='font-medium text-gray-800'>{data.name} </h1>
                <p className='text-sm text-gray-500 '> ₹ {data.price}X{data.quantity}</p>
                <p className='font-bold text-gray-900'> ₹ {data.price*data.quantity}</p>

            </div>
           
        </div>
         <div className='flex items-center gap-3'>
                 <button className='p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200' onClick={()=> handleDecrease(data.id , data.quantity)} >
                   <FaMinus size={12} />
                </button>
                
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={quantityInput}
                                            onChange={(e) => handleQuantityChange(data.id, e.target.value)}
                                            className='w-12 rounded-md border border-gray-300 bg-white px-1.5 py-1 text-center text-sm font-medium text-gray-800 outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d]'
                                        />
                
                 <button className='p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200' onClick={()=> handleIncrease(data.id , data.quantity)} >
                    <FaPlus size={12} />
                </button>

                <button className='p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 ' onClick={()=>dispatch(removeCartItem(data.id))}>
                    <FaTrash />

                </button>

            </div>
      
    </div>
  )
}

export default CartItemCart
