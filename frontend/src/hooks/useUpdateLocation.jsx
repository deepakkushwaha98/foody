import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../redux/mapSlice";

const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const updateLocation = async (lat, lon) => {
      try {
        const res = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );

        console.log("Location updated:", res.data);
        dispatch(setLocation({ lat, lon }));
      } catch (err) {
        console.log("API error:", err);
      }
    };

    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        updateLocation(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        console.log("Geolocation error:", error.message);
      }
    );
  }, [userData, dispatch]);
};

export default useUpdateLocation;
