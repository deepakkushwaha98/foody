import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData , setCurrentCity, setCurrentState, setCurrentAddress } from "../redux/userSlice";
import { setAddress, setLocation  } from "../redux/mapSlice";

const useGetCity= () => {

  const dispatch = useDispatch()
  const {userData } = useSelector(state =>state.user)
  const apikey = import.meta.env.VITE_GEOAPIKEY

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(async(position)=>{
        console.log(position);
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        dispatch(setLocation({lat:latitude , lon:longitude}))

        const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`)
        dispatch(setCurrentCity(result?.data?.results[0].city));
        console.log(result?.data?.results[0].city)
         dispatch(setCurrentState(result?.data?.results[0].state));
         dispatch(setCurrentAddress(result?.data?.results[0].address_line2));
         console.log("City set to:", result?.data?.results[0].city)
         console.log(result?.data?.results[0].address_line2)

        const finalAddress = result?.data?.results[0].address_line2
        dispatch(setAddress(result?.data?.results[0].address_line2))
        
        
    }, (error) => {
        console.error('Geolocation error:', error);
        // Don't set default city, user must enter manually
    })

  },[userData])
 
  

};


export default useGetCity;
