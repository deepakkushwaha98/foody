import React from 'react'
import scooter from "../assets/images/scooter.png"
import home  from "../assets/images/home.png"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
//import { data } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
 const deliveryBoyIcan = new L.Icon({
        iconUrl: scooter,
        iconSize: [40, 40],
        iconAnchor: [20, 40],

      }); 
      const customerIcon = new L.Icon({
        iconUrl: home,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        
      });  
      

const DeliveryBoyTracking = ({data}) => {
    console.log("DeliveryBoyTracking received data", data);
    // derive coordinates from whichever structure is provided
    const dbLoc = data?.deliveryBoyLocation || data?.deliveryBoyLocation;
    const custLoc = data?.deliveryAddress || data?.customerLocation;

    const deliveryBoyLat = dbLoc?.lat ?? dbLoc?.latitude ?? null;
    const deliveryBoyLon = dbLoc?.lon ?? dbLoc?.longitude ?? null;
    const customerLat = custLoc?.lat ?? custLoc?.latitude ?? null;
    const customerLon = custLoc?.lon ?? custLoc?.longitude ?? null;

    // if any coordinate is missing or not a number, skip rendering the map entirely
    const missing = [deliveryBoyLat, deliveryBoyLon, customerLat, customerLon].some(
        v => v === undefined || v === null || Number.isNaN(v)
    );
    if (missing) {
      console.warn("DeliveryBoyTracking skipping map, coordinates missing", {
        deliveryBoyLat,
        deliveryBoyLon,
        customerLat,
        customerLon,
        rawData: data
      });
      return <p className="text-center text-gray-500">Location data unavailable</p>;
    }

    const path = [
      [deliveryBoyLat, deliveryBoyLon],
      [customerLat, customerLon],
    ];

    const center = [deliveryBoyLat, deliveryBoyLon];
    
  return (
    <div className='w-full h-[400px] mt-3 overflow-hidden shadow-md '>
       <MapContainer className={"w-full h-full"}
                       center={center} 
                       zoom={16} >
              <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> 
            <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcan}>
              <Popup>Delivery Boy</Popup>
            </Marker>
            <Marker position={[customerLat, customerLon]} icon={customerIcon}>
              <Popup>Customer</Popup>
            </Marker>

            <Polyline positions={path} color="blue" weight={4}/>
                      
       </MapContainer>
    </div>
  )
}

export default DeliveryBoyTracking
