import { useEffect, useState } from "react";
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
        console.log(err)
    };

   
 }
 fetchUser()
}, []);

};


export default useGetCurrentUser;
