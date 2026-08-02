import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";
import { addMyOrder, clearCart } from '../../redux/userSlice';
import { setAddress, setLocation } from '../../redux/mapSlice';
import axios from 'axios';
import { MdDeliveryDining } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import { serverUrl } from '../../App';

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
  const {cartItems , totalAmount, cartOutletName} = useSelector(state =>state.user)
  
  const dispatch = useDispatch()
  const [addressInput , setAddressInput] = useState("")
  const paymentMethod = "cod"
  const [couponCode, setCouponCode] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const deliveryFee = totalAmount>500?0:40;
  const packagingCharges = totalAmount > 0 ? Math.max(20, Math.round(totalAmount * 0.015)) : 0
  const platformFee = totalAmount > 0 ? 8 : 0
  const gst = Math.round(totalAmount * 0.05)
  const subtotal = totalAmount
  const payableAmount = Math.max(0, subtotal + deliveryFee + packagingCharges + platformFee + gst - discountAmount)

  const applyCoupon = async () => {
    try {
      setErrorMessage("")
      if (!couponCode.trim()) {
        setDiscountAmount(0)
        return
      }

      const result = await axios.post(
        `${serverUrl}/api/coupon/validate`,
        {
          couponCode,
          subtotal,
        },
        { withCredentials: true }
      )

      setDiscountAmount(result.data?.discountAmount || 0)
    } catch (err) {
      setDiscountAmount(0)
      setErrorMessage(err?.response?.data?.message || 'Invalid coupon code')
    }
  }

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

const getLatlngByAddress = async ()=>{
  try{
    if(!addressInput || !addressInput.trim()){
      setErrorMessage('Please enter an address')
      return
    }
    setErrorMessage("")
    const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&format=json&apiKey=${apikey}`)
    const first = result?.data?.features?.[0] || result?.data?.results?.[0]
    if(!first){
      setErrorMessage('Address not found')
      return
    }
    // Geoapify may return features with geometry.coordinates [lon, lat]
    let lat, lon
    if(first.geometry && Array.isArray(first.geometry.coordinates)){
      lon = first.geometry.coordinates[0]
      lat = first.geometry.coordinates[1]
    } else if(first.lat && first.lon){
      lat = first.lat; lon = first.lon
    } else if(first.location && first.location.lat && first.location.lon){
      lat = first.location.lat; lon = first.location.lon
    }

    if(!lat || !lon){
      setErrorMessage('Unable to parse geocode result')
      return
    }

    dispatch(setLocation({lat, lon}))
    dispatch(setAddress(addressInput))
    setAddressInput(addressInput)
  }
  catch(err){
    console.error('getLatlngByAddress error', err)
    setErrorMessage('Failed to lookup address')
  }
}


const handlePlaceOrder = async () => {
  try {
    setLoading(true)
    setErrorMessage("")

    if (!cartItems.length) {
      setErrorMessage('Your cart is empty')
      return
    }

    const deliveryAddress = {
      text: addressInput,
      latitude: location.lat,
      longitude: location.lon,
    }

    const result = await axios.post(`${serverUrl}/api/order/place-order`, {
      paymentMethod,
      deliveryAddress,
      couponCode,
      totalAmount: payableAmount,
      cartItems,
    }, { withCredentials: true });

    dispatch(addMyOrder(result.data));
    dispatch(clearCart())
    localStorage.removeItem('foody-cart-state')
    // clear server-side cart as well
    try{
      await axios.delete(`${serverUrl}/api/cart/clear`, { withCredentials: true })
    }catch(e){
      console.warn('failed to clear server cart', e?.response?.data || e.message || e)
    }
    // navigate to order placed page with order data
    navigate('/order-placed', { state: { order: result.data } })

  }
  catch(e){
    console.error('placeOrder error', e)
    setErrorMessage(e?.response?.data?.message || 'Failed to place order')

  }

  finally{
    setLoading(false)
  }

}


useEffect(()=>{
  setAddressInput(address)

},[address])



    
  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,243,238,0.95),_rgba(255,249,246,0.98)_42%,_#fff9f6_100%)] flex items-center justify-center p-6'>
         <div className='absolute top-[20px] left-[20px] z-[10] ' onClick={()=>navigate("/")}>
                        <IoMdArrowBack size={35} className='text-[#ff4d2d] ' />
         </div>
         <div className='w-full  max-w-[900px] bg-white rounded-3xl shadow-[0_24px_70px_rgba(255,124,77,0.12)] p-6 space-y-6 border border-[#ffd7c8] '>
            <div className='flex items-center justify-between gap-4'>
              <h1 className='text-2xl font-bold'>Checkout</h1>
              <div className='rounded-full bg-[#fff0e8] px-3 py-1 text-sm font-semibold text-[#ff5b34]'>
                {cartOutletName || 'Selected outlet'}
              </div>
            </div>
            {errorMessage ? <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>{errorMessage}</div> : null}
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
              <div className='grid grid-cols-1 gap-4'>
                <div className='flex items-center gap-3 rounded-xl border p-4 text-left transition border-[#ff4d2d] bg-orange-50 shadow'>

                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                    <MdDeliveryDining className='text-green-600 text-xl' />

                  </span>
                  <div>
                    <p className='font-medium text-gray-800 '>Cash On Delivery</p>
                    <p className='text-xs text-gray-500'>Pay when your food arrives</p>
                  </div>

                </div>

              </div>
            </section>

            <section className='rounded-2xl border border-[#f1dfd5] bg-[#fffaf7] p-4'>
              <h2 className='text-lg font-semibold text-gray-800'>Coupon</h2>
              <div className='mt-3 flex gap-2'>
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className='flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Apply coupon code' />
                <button type='button' onClick={applyCoupon} className='rounded-lg bg-[#ff4d2d] px-4 py-2 text-sm font-semibold text-white'>Apply Coupon</button>
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
                      ₹ {subtotal}
                    </span>
                
               </div>

               <div className='flex justify-between font-medium text-gray-800'>
                <span>
                  Delivery Fee
                </span>
                <span>
                  {deliveryFee ==0?"Free":`₹ ${deliveryFee}`}
                </span>
               </div> 
               <div className='flex justify-between font-medium text-gray-800'>
                <span>
                  Packaging Charges
                </span>
                <span>
                  ₹ {packagingCharges}
                </span>
               </div>
               <div className='flex justify-between font-medium text-gray-800'>
                <span>
                  Platform Fee
                </span>
                <span>
                  ₹ {platformFee}
                </span>
               </div>
               <div className='flex justify-between font-medium text-gray-800'>
                <span>
                  GST / Taxes
                </span>
                <span>
                  ₹ {gst}
                </span>
               </div>
               <div className='flex justify-between font-medium text-gray-800'>
                <span>
                  Discount
                </span>
                <span>
                  -₹ {discountAmount}
                </span>
               </div>
               <div className='flex justify-between font-medium text-[#ff4d2d]'>
                <span>
                  Total Amount
                </span>
                <span>
                  ₹ {payableAmount}
                </span>
               </div>
              </div>
            </section>
            <section className='rounded-2xl border border-[#f0d8cd] bg-[#fffaf7] p-4'>
              <h3 className='flex items-center gap-2 text-sm font-semibold text-slate-900'><FaShieldAlt className='text-[#ff5b34]' /> Secure Payments</h3>
              <p className='mt-2 text-xs leading-6 text-slate-500'>Cash on delivery is available now. Secure digital payments can be added later without changing the checkout structure.</p>
              <div className='mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600'>
                <span className='rounded-full bg-white px-3 py-1 shadow-sm'>COD</span>
                <span className='rounded-full bg-white px-3 py-1 shadow-sm'>Secure Checkout</span>
              </div>
            </section>
            <button disabled={loading || cartItems.length === 0} className='rounded-xl bg-[#ff4d2d] w-full hover:bg-[#e64526] text-white py-3 transition-colors cursor-pointer font-semibold disabled:cursor-not-allowed disabled:opacity-60' onClick={handlePlaceOrder}>{loading ? 'Processing...' : 'Place Order'}</button>
         </div>
        
      
    </div>
  )
}

export default CheckOut