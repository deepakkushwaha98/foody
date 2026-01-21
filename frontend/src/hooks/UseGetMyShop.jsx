import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData, setMyShopLoading } from "../redux/ownerSlice";

const useGetMyShop = () => {

  const dispatch = useDispatch()
  const {userData} = useSelector(state =>state.user)
 
  useEffect(() => {
    console.log('UseGetMyShop userData:', userData);
    if (!userData) return; // wait until user data/auth is available
    const fetchShop = async () => {
      try {
        dispatch(setMyShopLoading(true));
        const result = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          { withCredentials: true }
        );

        // API returns an array (possibly empty). Convert empty array to null
        // so UI checks like `!myShopData` work as expected.
        const payload = Array.isArray(result.data) && result.data.length > 0
          ? result.data[0]
          : null;

        dispatch(setMyShopData(payload));
        console.log('get-my shop status', result.status);
        console.log('get-my shop headers', result.headers);
        console.log('get-my shop body', result.data);
      } catch (err) {
        if (err?.response?.status === 400) return;
        console.error('get-my shop error', err);
      } finally {
        dispatch(setMyShopLoading(false));
      }
    }
    fetchShop()
}, [dispatch, userData]);

};


export default useGetMyShop;
