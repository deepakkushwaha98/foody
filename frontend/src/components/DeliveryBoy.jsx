import React from 'react'
import axios from 'axios'
import Nav from './Nav'
import { useSelector, useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { useEffect ,useState} from 'react'
import { FaAssistiveListeningSystems } from 'react-icons/fa'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { useSocket } from '../context/SocketContext'
import { decrementAvailableDeliveryOrders, incrementAvailableDeliveryOrders, setAvailableDeliveryOrders } from '../redux/userSlice'

const DeliveryBoy = () => {
  const [otp , setOtp] = useState("")
  const [shopOtpBox , setShopOtpBox] = useState(false);
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { socket } = useSocket()
  const [currentOrder , setCurrentOrder] = useState();
  const [availableAssignment, setAvailableAssignment] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
   
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
   
  useEffect(()=>{
    if(!socket || userData.role !=="deliveryBoy"){
      return
    }
    let watchId;

    if(navigator.geolocation){
       watchId = navigator.geolocation.watchPosition((position)=>{
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setDeliveryBoyLocation({lat:latitude, lon:longitude})
        socket.emit("updateLocation", {
          latitude,
          longitude,
          userId: userData._id
        })
      }),
      (err)=>{
        console.log("Error getting location:", err);
      },
      {
        enableHighAccuracy:true,
      }
    }
    return ()=>{
      if(watchId && navigator.geolocation){
        navigator.geolocation.clearWatch(watchId)
      }
    }
  },[])


  const getAssignment = async()=>{
    try{
      const result =await axios.get(`${serverUrl}/api/order/get-assignment` ,
        {withCredentials:true},
 
      )
      console.log(result.data)
      setAvailableAssignment(result.data)
      dispatch(setAvailableDeliveryOrders(result.data.length))

    }
    catch(err){
      console.log(err);

    }
  }

  const  getCurrentOrder = async()=>{ 
    try{

      const result = await axios.get(`${serverUrl}/api/order/get-current-order` , {withCredentials:true})
      console.log("current order" , result.data)
      // save response so we can render it later
      setCurrentOrder(result.data);

    }
    catch(err){
      console.log(err);
      // If no current assignment/order exists, clear the current order state
      if (err?.response?.status === 404) {
        setCurrentOrder(null)
      }
    }
  }

 useEffect(()=>{
  getAssignment() 
  getCurrentOrder()

 },[userData])
 
  


 const acceptOrder = async(assignmentId)=>{
  if(actionLoading) return
  setActionLoading(true)
  try{
    const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}` ,{withCredentials:true})
    console.log(result.data)
    await getCurrentOrder();
    setAvailableAssignment(prev => (prev || []).filter(item => String(item.assignmentId) !== String(assignmentId)))
    dispatch(decrementAvailableDeliveryOrders())
  }
  catch(err){
    console.log(err);
  } finally {
    setActionLoading(false)
  }
 }


  const sendOtp = async()=>{
    if(actionLoading || !currentOrder) return
    setActionLoading(true)
  try{
    const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
      orderId: currentOrder?._id,
      shopOrderId: currentOrder?.shopOrder?._id
    }, {withCredentials:true});
    console.log(result.data);
    setShopOtpBox(true);
  }
  catch(err){
    console.log(err);
  } finally {
    setActionLoading(false)
  }
 }


 const verifyOtp = async()=>{
  if(actionLoading || !currentOrder || !otp.trim()) return
  setActionLoading(true)
  try{
    const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
      orderId: currentOrder?._id,
      shopOrderId: currentOrder?.shopOrder?._id,
      otp,
    }, { withCredentials: true })

    console.log(result.data)
    setCurrentOrder(null)
    setShopOtpBox(false)
    setOtp("")
  }
  catch(err){
    console.log(err);
  } finally {
    setActionLoading(false)
  }
 }



 useEffect(()=>{

  const handleNewAssignment = (data) => {
    console.log("New assignment received:", data);
    if(data.sentTO === userData?._id || String(data.sentTO) === String(userData?._id)){
      console.log("Assignment is for this delivery boy, adding to available");
      setAvailableAssignment(prev => prev ? [...prev, data] : [data])
      dispatch(incrementAvailableDeliveryOrders())
    }
  }

  const handleUpdateStatus = (data) => {
    console.log("Delivery boy received status update:", data);
    if (!data?.orderId) return;

    // If the update belongs to the current order, refresh the view
    if (data.orderId === currentOrder?._id) {
      getCurrentOrder();
    }
  }

  socket?.on("newAssignment", handleNewAssignment)
  socket?.on("update-status", handleUpdateStatus)
  
   return ()=>{
    socket?.off("newAssignment", handleNewAssignment)
    socket?.off("update-status", handleUpdateStatus)
   }


 }, [socket, userData, currentOrder, dispatch])






  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col'>
      <Nav />
      
      <div className='flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12'>
        {/* Welcome Card */}
        <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-l-4 border-[#ff4d2d] mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#ff4d2d] mb-4 text-center'>
            Welcome, {userData?.fullName}
          </h1>
          <p className='text-gray-600 text-center text-sm sm:text-base'>
            You are online and ready to deliver orders
          </p>
        </div>

        {/* Location Card */}
        <div className='w-full max-w-md bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-[#ff4d2d] mb-8'>
          <h2 className='text-lg sm:text-xl font-semibold text-[#ff4d2d] mb-4'>Your Current Location</h2>
          <div className='space-y-3 text-sm sm:text-base'>
            <div className='flex justify-between items-center bg-white rounded-lg p-3'>
              <span className='font-semibold text-gray-700'>Latitude:</span>
              <span className='text-[#ff4d2d] font-mono'>{deliveryBoyLocation?.lat?.toFixed(6)}</span>
            </div>
            <div className='flex justify-between items-center bg-white rounded-lg p-3'>
              <span className='font-semibold text-gray-700'>Longitude:</span>
              <span className='text-[#ff4d2d] font-mono'>{deliveryBoyLocation?.lon?.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm sm:text-base'>Status</p>
              <p className='text-lg sm:text-2xl font-bold text-green-600'>Active</p>
            </div>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
              <div className='w-10 h-10 bg-green-500 rounded-full animate-pulse'></div>
            </div>
          </div>
        </div>
         

         {!currentOrder &&  <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100 '>
          <h1 className='text-lg font-bold mb-4 flex items-center gap-2 '>
            Available orbers
          </h1>

          
           
            <div className='space-y-4'>
            {availableAssignment?.length > 0 ? (
              availableAssignment.map((assignment, index) => (
                <div key={index} className='bg-orange-50 border flex justify-between items-center border-orange-200 rounded-lg p-4'>
                  <div>
                    <p className='text-sm font-semibold'>{assignment?.shopName}</p>
                   <p className='text-sm text-gray-500 ' >{assignment?.deliveryAddress.text}</p>
                   <p className='text-xs text-gray-400'>{assignment.items.length} items | {assignment.subtotal} </p>
                  </div>

                  <button disabled={actionLoading} className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60' onClick={()=>acceptOrder(assignment.assignmentId)}>
                    {actionLoading ? 'Please wait...' : 'Accept'}
                  </button>
                  

                </div>
              ))


            ) : (
              <p className='text-gray-500 text-sm'>No available orders</p>
            )}

           </div>
        </div>}



{currentOrder &&  <div className='bg-white rounded-2xl p-5 shadow-md border border-orange-100'>
          <h2>Current Order</h2>

          <div className='text-lg font-bold mb-3'>
            <p className='font-semibold text-sm'>{currentOrder?.shopOrder?.shop?.name}</p>
            <p className='text-sm text-gray-500'>{currentOrder?.deliveryAddress?.text} </p>
            <p className='text-xs text-gray-400'>{currentOrder?.shopOrder?.shopOrderItem?.length || 0} items | {currentOrder?.shopOrder?.subtotal} </p>
          </div>

          <DeliveryBoyTracking  data={ {
                  deliveryBoyLocation: deliveryBoyLocation ||{
                    
                    lat: userData.location?.coordinates?.[1] ?? null,
                    lon: userData.location?.coordinates?.[0] ?? null
                  },
                   customerLocation: {
                    lat: currentOrder?.deliveryAddress?.latitude ?? null,
                    lon: currentOrder?.deliveryAddress?.longitude ?? null
                  }
                }} />
          {!shopOtpBox ?<button disabled={actionLoading} className='mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60' onClick={sendOtp}>
            {actionLoading ? 'Sending OTP...' : 'Mark as Delivered'}</button>: <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
              <p>Enter Otp send to <span className='text-orange-500'>{currentOrder.user.fullName}</span>  </p>
              <input type="text" className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ' placeholder='Enter Otp' value={otp} onChange={(e)=>setOtp(e.target.value)}/>
              <button disabled={actionLoading || !otp.trim()} className='w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60' onClick={verifyOtp}>{actionLoading ? 'Verifying...' : 'Submit OTP'}</button>
           </div>
           }
        </div> }


        
        
      </div>




    </div>
  )
}

export default DeliveryBoy
