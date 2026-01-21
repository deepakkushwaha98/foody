import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import { setShopInMyCity } from "../redux/userSlice";
import { setItemInMyCity } from "../redux/userSlice";
const UseGetItemByCity = () => {

  const {currentCity} = useSelector(state=>state.user)  

  const dispatch = useDispatch()
 
  useEffect(() => {
    console.log('UseGetItemByCity currentCity:', currentCity);
    if(!currentCity) return;
    const fetchItems = async () => {
      try {
        console.log('fetching items for city:', currentCity);
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          { withCredentials: true }
        );

        dispatch(setItemInMyCity(result.data));
        console.log('get-by-city items status:', result.status);
        console.log('get-by-city items body:', result.data);

      } catch (err) {
       
        if (err?.response?.status === 400) return;
        console.error('get-by-city items error:', err);
    };

   
 }
 fetchItems()
}, [currentCity]);

};



export default UseGetItemByCity
