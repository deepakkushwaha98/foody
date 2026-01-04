import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {

  const dispatch = useDispatch()
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        );

         dispatch(setUserData(result.data))

        console.log(result)
      } catch (err) {
        // If there's no authenticated user, backend returns 400 (token missing).
        // Ignore 400 to avoid noisy logs; surface other errors.
        if (err?.response?.status === 400) return;
        console.error(err);
    };

   
 }
 fetchUser()
}, [dispatch]);

};


export default useGetCurrentUser;
