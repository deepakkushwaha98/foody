import React from 'react'
import axios from 'axios'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { useEffect ,useState} from 'react'
import { FaAssistiveListeningSystems } from 'react-icons/fa'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { useSocket } from '../context/SocketContext'

const DeliveryBoy = () => {
  const [otp , setOtp] = useState("")
  const [shopOtpBox , setShopOtpBox] = useState(false);
  const { userData } = useSelector(state => state.user)
  const { socket } = useSocket()
  const [currentOrder , setCurrentOrder] = useState();
  const [availableAssignment, setAvailableAssignment] = useState(null)
  const getAssignment = async()=>{
    try{
      const result =await axios.get(`${serverUrl}/api/order/get-assignment` ,
        {withCredentials:true},
 
      )
      console.log(result.data)
      setAvailableAssignment(result.data)

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
    }
  }

 useEffect(()=>{
  getAssignment() 
  getCurrentOrder()

 },[userData])
 
  


 const acceptOrder = async(assignmentId)=>{
  try{
    const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}` ,{withCredentials:true})
    console.log(result.data)
    await getCurrentOrder();
  }
  catch(err){
    console.log(err);
  }
 }


  const sendOtp = async()=>{
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
  }
 }


 const verifyOtp = async()=>{
  try{
    const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp` , {orderId: currentOrder?._id, shopOrderId: currentOrder?.shopOrderId, otp} ,{withCredentials:true})
    console.log(result.data)
    
  }
  catch(err){
    console.log(err);
  }
 }



 useEffect(()=>{

  socket?.on("newAssignment" , (data)=>{
    console.log("New assignment received:", data);
    if(data.sentTO === userData?._id || String(data.sentTO) === String(userData?._id)){
      console.log("Assignment is for this delivery boy, adding to available");
      setAvailableAssignment(prev => prev ? [...prev, data] : [data])
    }
  })
  
   return ()=>{
    socket?.off("newAssignment")
   }


 }, [socket, userData])






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
              <span className='text-[#ff4d2d] font-mono'>{userData?.location?.coordinates[1]?.toFixed(6)}</span>
            </div>
            <div className='flex justify-between items-center bg-white rounded-lg p-3'>
              <span className='font-semibold text-gray-700'>Longitude:</span>
              <span className='text-[#ff4d2d] font-mono'>{userData?.location?.coordinates[0]?.toFixed(6)}</span>
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

                  <button className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors' onClick={()=>acceptOrder(assignment.assignmentId)}>
                    Accept
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

          <DeliveryBoyTracking  data={currentOrder} />
          {!shopOtpBox ?<button className='mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200 ' onClick={sendOtp}>
            Mark as Delivered</button>: <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
              <p>Enter Otp send to <span className='text-orange-500'>{currentOrder.user.fullName}</span>  </p>
              <input type="text" className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ' placeholder='Enter Otp' value={otp} onChange={(e)=>setOtp(e.target.value)}/>
              <button className='w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200 ' onClick={verifyOtp}>Submit OTP</button>
           </div>
           }
        </div> }


        
        
      </div>




    </div>
  )
}

export default DeliveryBoy
