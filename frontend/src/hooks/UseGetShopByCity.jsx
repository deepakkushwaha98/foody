import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import { setShopInMyCity } from "../redux/userSlice";

const UseGetShopByCity = () => {

  const {currentCity} = useSelector(state=>state.user)  

  const dispatch = useDispatch()
 
  useEffect(() => {
    console.log('UseGetShopByCity currentCity:', currentCity);
    if(!currentCity) return;
    const fetchShop = async () => {
      try {
        console.log('fetching shops for city:', currentCity);
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true }
        );
        dispatch(setShopInMyCity(result.data));
        console.log('get-by-city shops status:', result.status);
        console.log('get-by-city shops body:', result.data);
      } catch (err) {
       
        if (err?.response?.status === 400) return;
        console.error('get-by-city shops error:', err);
    };

   
 }
 fetchShop()
}, [currentCity]);

};



export default UseGetShopByCity
