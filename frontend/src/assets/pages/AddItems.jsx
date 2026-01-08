import React, { useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { useRef } from 'react';
import axios from 'axios';

import { serverUrl } from '../../App';
import { setMyShopData } from '../../redux/ownerSlice';
const AddItems = () => {
    const navigate = useNavigate()
    
   const dispatch = useDispatch()

    const {myShopData} = useSelector(state=>state.owner)
     const [name , setName] = useState("")

     const [price , setPrice] = useState(0);
     const [category , setCategory] = useState("")
     const [foodType , setFoodType] = useState("veg")
     const categories = ["Snakes",
            "Main Course",
            "Desserts",
            "Pizza",
            "Burgers",
            "Sandwiches",
            "South Indian",
            "North Indian",
            "Chinese",
            "Fast Food",
            "others"
        ]
    
    const [frontendImage , setFrontendImage] = useState( null)
    const [backendImage , setBackendImage] = useState(null)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const formData = new FormData()
            formData.append("name" , name)
            formData.append("category" , category)
            formData.append("foodType" , foodType)
            formData.append("price" , price)
          
          
            if(backendImage){
                formData.append("image" , backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/item/add-item`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            console.log(result.data)
        }
        catch(err){
            console.log(err)

        }
    }

    const handleImage = (e)=>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file));
    }

  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br
    from-orange-50 relative to-white min-h-screen '>
        <div className='absolute top-[20px] left-[20px] mb-[10px] ' onClick={()=>navigate("/")}>
            <IoMdArrowBack size={35} className='text-[#ff4d2d] ' />
        </div>

        <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
            <div className='flex flex-col items-center mb-6'>
                <div className='bg-orange-100 p-4 rounded-full mb-4 '>
                   <FaUtensils className='text-[#ff4d2d] w-16 h-16 ' />
                </div>

                <div className='text-3xl font-extrabold tetx-gray-900 '>
                    Add Food
                </div>

            </div>
            <form action="" className='space-y-5' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                    <input type="text" placeholder='Enter Shop name' className='w-full px-4 py-2 
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=> setName(e.target.value)} value={name} />
                </div>

                 <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                    <input type="file" accept='image/*' className='w-full px-4 py-2 
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(handleImage)} />


                    {frontendImage && <div>
                        <img src={frontendImage} alt="" className='w-full h-48 object-cover rounded-lg border' />
                    </div>}

                    <div>
                    <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                    <input type="number" placeholder='0' className='w-full px-4 py-2 
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=> setPrice(e.target.value)} value={price} />
                     </div>

                     <div>
                    <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Food Type </label>
                    <select  className='w-full px-4 py-2 
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=> setFoodType(e.target.value)} value={foodType} >
                       <option value="vey">veg</option>
                       <option value="non veg">non veg</option>
                    </select>

                     </div>

                     <div>
                    <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Select Category </label>
                    <select  className='w-full px-4 py-2 
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=> setCategory(e.target.value)} value={category} >
                        <option value="">select  Category</option>
                        {categories.map((cate , idx) =>(
                            <option value={cate }key={idx}>{cate}</option>
                        ))}
                    </select>

                     </div>


                </div>

               <button type='submit' className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold
               shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer '>
                Save
               </button>
               

            </form>

        </div>
       
      
    </div>
  )
}

export default AddItems
