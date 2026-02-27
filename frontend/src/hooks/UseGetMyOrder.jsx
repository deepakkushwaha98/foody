import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopLoading } from "../redux/ownerSlice";
import { setMyOrders } from "../redux/userSlice";
const useGetMyOrder = ()=>{

  const dispatch = useDispatch()
  const {userData} = useSelector(state =>state.user)
 
  useEffect(() => {
    console.log('UseGetMyOrder userData:', userData);
    if (!userData) return; // wait until user data/auth is available
    const fetchOrders = async () => {
      try {
        dispatch(setMyShopLoading(true));
        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          { withCredentials: true }
        );

        dispatch(setMyOrders(result.data))
        
        console.log('get-my order body', result.data);
      } catch (err) {
        if (err?.response?.status === 400) return;
        console.error('get-my order error', err);
      } finally {
        dispatch(setMyShopLoading(false));
      }
    }
    fetchOrders()
}, [dispatch, userData]);

};


export default useGetMyOrder;
