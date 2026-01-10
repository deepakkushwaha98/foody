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
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true }
        );

        // API returns an array (possibly empty). Convert empty array to null
        // so UI checks like `!myShopData` work as expected.
        const payload = Array.isArray(result.data) && result.data.length > 0
          ? result.data[0]
          : null;

        dispatch(setShopInMyCity(result.data));
        console.log("by city", result.data)

        console.log('get-my shop', result.data)
      } catch (err) {
       
        if (err?.response?.status === 400) return;
        console.error(err);
    };

   
 }
 fetchShop()
}, [currentCity]);

};



export default UseGetShopByCity
