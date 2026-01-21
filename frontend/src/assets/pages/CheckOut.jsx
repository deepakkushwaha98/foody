import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import { TbCurrentLocation, TbLockCancel } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";
import { setShopInMyCity } from '../../redux/userSlice';
import { setAddress, setLocation } from '../../redux/mapSlice';
import axios from 'axios';
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lon) {
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);

  return null;
}




const CheckOut =()=>{
  const navigate = useNavigate()
  const {location , address}  = useSelector(state =>state.map)
  const {cartItems , totalAmount} = useSelector(state =>state.user)
  
  const dispatch = useDispatch()
  const [addressInput , setAddressInput] = useState("")
  const [paymentMethod , setPaymentMethod] = useState("cod")
  const deliveryFee = totalAmount>500?0:40;
  const AmountWithDeliveryFee = totalAmount + deliveryFee; 
  const onDragEnd =(e)=>{
    console.log(e)
    const { lat, lng} = e.target.getLatLng();
  dispatch(setLocation({ lat, lon: lng }));
   getAddressByLatLng(lat , lng)
    }

    const apikey = import.meta.env.VITE_GEOAPIKEY

    const getAddressByLatLng = async(lat , lng)=>{
   try{
    
    const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`)
     console.log("move location" , result?.data?.results[0].address_line2)

     dispatch(setAddress(result?.data?.results[0].address_line2))
   }
   catch(e){
     console.log(e)

   }
}


const getCurrentLocaton = async()=>{
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(async(position)=>{
        console.log(position);
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        dispatch(setLocation({lat:latitude , lon:longitude}))

        getAddressByLatLng(latitude , longitude)
      
      }, (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please check your browser settings and allow location access.');
      }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });


}


const  getLatlngByAddress =async ()=>{
  try{

    const result = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        addressInput
      )}&format=json&apiKey=${apikey}`
    );
    const lat = result?.data?.results?.[0]?.lat;
    const lon = result?.data?.results?.[0]?.lon;

    if (lat && lon) {
      dispatch(setLocation({ lat, lon }));
      dispatch(setAddress(result.data.results[0].address_line2));
    }
      

  }
  catch(e){
    console.log(e);

  }

}


useEffect(()=>{
  setAddressInput(address)

},[address])



    
  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
         <div className='absolute top-[20px] left-[20px] z-[10] ' onClick={()=>navigate("/")}>
                        <IoMdArrowBack size={35} className='text-[#ff4d2d] ' />
         </div>
         <div className='w-full  max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6 '>
            <h1 className='text-2xl font-bold'>Checkout</h1>
             <section className=' '>
              <h2 className='text-lg  font-semibold mb-2 flex items-center gap-2 text-gray-800'>
                <IoLocation  className='text-[#ff4d2d] '/> Delivery Location  </h2>
              <div className='flex gap-2 mb-3'>
                <input type="text" name="" id="" className='flex-1 border border-gray-300 rounded-lg p-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] ' placeholder='Enter your food Delivery address' value={addressInput}  onChange={(e) => setAddressInput(e.target.value)}/>
                <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center
                justify-center ' onClick={getLatlngByAddress}>
                    <IoSearchSharp />

                </button>
                <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center
                justify-center'  onClick={getCurrentLocaton}>
                    <TbCurrentLocation />
                </button>
              </div>
              <div className='rounded-xl border overflow-hidden'>

                <div className='h-64 w-full flex items-center justify-center'>
                    <MapContainer className={"w-full h-full"}
                  center={location ? [location.lat, location.lon] : [28.6139, 77.2090]} 
                  zoom={16}
                  
                  >
                     <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  /> 
                 
                
                   <RecenterMap location={location} />
                 {location?.lat && location?.lon && (
                   <Marker
                    position={[location.lat, location.lon]}
                    draggable={true}
                    eventHandlers={{
                      dragend: onDragEnd,
                    }}
                  />
                  )}
                
                  </MapContainer>
                </div>

              </div>
            </section>


            <section>
              <h2 className='text-lg font-semibold b-3 text-gray-800'> Payment Method</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  paymentMethod === "cod"? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-50 hover:border-gray-300"
                }`} onClick={()=>setPaymentMethod("cod")}>

                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                    <MdDeliveryDining className='text-green-600 text-xl' />

                  </span>
                  <div>
                    <p className='font-medium text-gray-800 '>Cash On Delivery</p>
                    <p className='text-xs text-gray-500'>Pay when your food arrives</p>
                  </div>

                </div>


                <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  paymentMethod === "online"? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-50 hover:border-gray-300"
                }`} onClick={()=>setPaymentMethod("online")}>

                    <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                      <FaMobileScreenButton className='text-purple-700 text-lg'/>
                    </span>
                    <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                      <FaCreditCard className='text-blue-700 text-lg'/>

                    </span>

                    <div>
                      <p className='font-medium text-gray-800'>UPI/Credit.Debit card</p>
                      <p className='text-xs text-gray-500'>Pay Securely Online</p>
                    </div>

                </div>

              </div>
            </section>

            <section>
              <h2 className='text-lg font-semibold mb-3'>Order Summary</h2>

              <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
                {cartItems.map((item , index)=>(
                  <div key={index} className='flex justify-between text-sm text-gray-700'>
                    <span className=''>₹ {item.name}*{item.quantity} </span>
                    <span className=''>₹ {item.price*item.quantity} </span>

                  </div>

                ))}
                <hr className='border-gray-200 my-2' />

                <div className='flex justify-between font-medium text-gray-800'>
                  <span>
                    SubTotal
                    
                    </span>
                    <span>
                      {totalAmount}
                    </span>
                
               </div>

               <div className='flex justify-between font-medium text-gray-800'>
                <span>
                  Delivery Fee
                </span>
                <span>
                  {deliveryFee ==0?"Free":deliveryFee}
                </span>
               </div> 
               <div className='flex justify-between font-medium text-[#ff4d2d]'>
                <span>
                  Total Amount
                </span>
                <span>
                  {AmountWithDeliveryFee}
                </span>
               </div>
              </div>
            </section>
            <button className=' rounded-xl bg-[#ff4d2d] w-full hover:bg-[#e64526] text-white py-3 transition-colors  cursor-pointer
            font-semibold '>{paymentMethod=="cod"?"Place Order": "Pay & Place Order"}</button>
         </div>
        
      
    </div>
  )
}

export default CheckOut