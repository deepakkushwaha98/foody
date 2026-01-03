import React from 'react'
import { useSelector } from 'react-redux'
import Userdashboard from '../../components/Userdashboard'
import OwnerDashboad from '../../components/OwnerDashboad'
import DeliveryBoy from '../../components/DeliveryBoy'
import SuperAdmin from '../../components/SuperAdmin'


const Home = () => {
  const { userData } = useSelector((state) => state.user)

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] '>
      {userData?.role === "user" && <Userdashboard />}
      {userData?.role === "owner" && <OwnerDashboad />}
      {userData?.role === "deliveryBoy" && <DeliveryBoy />}
      {userData?.role === "superadmin" && <SuperAdmin />}


    </div>
  )
}

export default Home


