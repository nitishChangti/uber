// import React, { useState , useEffect } from 'react'
// import { logo, map } from '../assets/index'
// import { useRef } from 'react';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';
// import FinishRide from '../components/FinishRide';
// import { useLocation } from 'react-router-dom';
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine";
// import { useDispatch, useSelector } from "react-redux";
// import { sendMessage } from "../store/socketSlice";
// import axios from 'axios';
// const CaptainRiding = () => {
  
  
//   const [finishRidePanel, setFinishRidePanel] = useState(false)
//   const finishRidePanelRef = useRef(null)
//   const location = useLocation();
//   const rideData = location.state?.rideData;
//   const initialCaptainLocation = location.state?.captainInitialCoords;
//   const captain = useSelector((state) => state.auth.userData); // captain data
//   const dispatch = useDispatch();
//     const mapRef = useRef(null);
//     const markerRef = useRef(null);
//     const captainMarkerRef = useRef(null);
//     console.log(rideData);
//     const routeRef = useRef(null);
//    const pickupCoords = location.state?.pickupCoords;
//   const destinationCoords = location.state?.destinationCoords;
//   const hasStarted = location.state?.hasStarted || false;
// console.log("pickupCoords", pickupCoords);
// console.log("destinationCoords", destinationCoords);

//     // ⭐ INITIALIZE MAP
//   useEffect(() => {
//     if (mapRef.current) return;

//     mapRef.current = L.map("captain-map", {
//       zoom: 15,
//        center: [20.5937, 78.9629], // India center (just default)
//     });

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 20,
//     }).addTo(mapRef.current);

//       // Fix blank map on first load
//   setTimeout(() => {
//     mapRef.current.invalidateSize();
//   }, 300);
//   }, []);
  
//   useEffect(() => {
//   if (pickupCoords && mapRef.current) {
//     mapRef.current.setView([pickupCoords.lat, pickupCoords.lng], 15);
//   }
// }, [pickupCoords]);


//    // ⭐ Helper to update captain marker
//   const updateCaptainMarker = (coords) => {
//     if (!captainMarkerRef.current) {
//       captainMarkerRef.current = L.marker(coords).addTo(mapRef.current);
//     } else {
//       captainMarkerRef.current.setLatLng(coords);
//     }
//     mapRef.current.setView(coords);
//   };

//    const drawRoute = (from, to) => {
//   if (!from || !to || !mapRef.current) return;

//   if (routeRef.current) {
//     mapRef.current.removeControl(routeRef.current);
//   }

//   routeRef.current = L.Routing.control({
//     waypoints: [
//       L.latLng(from.lat, from.lng),
//       L.latLng(to.lat, to.lng)
//     ],
//     routeWhileDragging: false,
//     addWaypoints: false,
//     draggableWaypoints: false,
//       show: false,                 // Hides text panel
//     showAlternatives: false,     // Hides extra routes
//     lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
//     createMarker: () => null,
//   }).addTo(mapRef.current);
//    // Also hide the panel DOM manually
//   const panels = document.getElementsByClassName("leaflet-routing-container");
//   if (panels.length > 0) {
//     panels[0].style.display = "none";
//   }
// };
// // Draw route only after captain's first GPS location is known
// useEffect(() => {
//   if (!initialCaptainLocation || !pickupCoords || !destinationCoords || !mapRef.current) return;

//   if (!hasStarted) {
//     // Before OTP → Captain → Pickup
//     drawRoute(initialCaptainLocation, pickupCoords);
//   } else {
//     // After OTP → Captain → Destination
//     drawRoute(initialCaptainLocation, destinationCoords);
//   }

// }, [initialCaptainLocation, hasStarted, pickupCoords, destinationCoords]);

  
//   // ⭐ Captain Live GPS Tracking
// useEffect(() => {
//   if (!rideData || !captain) return;

//   const watchId = navigator.geolocation.watchPosition(
//     (pos) => {
//       const { latitude, longitude } = pos.coords;
//       const coords = [latitude, longitude];
     
//       updateCaptainMarker(coords);

//       dispatch(
//         sendMessage("captain-location-update", {
//           rideId: rideData._id,
//           captainId: captain._id,
//           lat: latitude,
//           lng: longitude,
//         })
//       );
//     },
//     (err) => console.log("GPS error:", err),
//     { enableHighAccuracy: true }
//   );

//   return () => navigator.geolocation.clearWatch(watchId);
// }, [rideData, captain]);



// console.log(initialCaptainLocation);
//     useGSAP(() => {
//         if (finishRidePanel) {
//             gsap.to(finishRidePanelRef.current, {
//                 transform: 'translateY(0)'
//             })
//         }
//         else {
//             gsap.to(finishRidePanelRef.current, {
//                 transform: 'translateY(100%)'
//             })
//         }
//     }, [finishRidePanel])


//     return (
//         <div className='w-full h-screen'>
//             <div className='fixed flex items-center justify-between top-5 px-5 w-full'>
//                 <div className='w-20 left-7'>
//                     <img className='' src={logo} alt="" />
//                 </div>
//                 <div className='w-10 h-10 rounded-full  bg-white flex items-center justify-center shadow-gray-600 '>
//                     <i className="text-2xl ri-login-box-line"></i>
//                 </div>
//             </div>

//   {/* ⭐ LIVE MAP */}
//       <div id="captain-map" className="w-full h-4/5"></div>

//       {/* Ride bottom panel */}
//             {/* here make h-3/5 for section2 and for section1 h-1/2  */}
//             {/* <div className='w-full h-4/5'>
//                 <img className='w-full h-full object-cover' src={map} alt="" />
//             </div> */}
//             {/* here make h-2/5 for section2 and for section1 h-1/2  */}
//             <div
//                 onClick={() => {
//                     setFinishRidePanel(true)
//                 }}
//                 className='w-full min-h-1/5 px-4 bg-amber-300'>
//                 <h1
//                     onClick={(e) => {
//                         setRidePopUpPanel(false)
//                     }}
//                     className='h-fit text-4xl text-center'><i className="ri-arrow-up-s-line"></i></h1>
//                 <div className='w-full h-full flex  gap-3 items-center justify-around '>
//                     <h1 className='text-xl font-bold'>4 KM away</h1>
//                     <button
//                         to="/captain-riding"
//                         onClick={() => {
//                         }}
//                         className='w-[200px] h-12 rounded-xl bg-emerald-400 text-xl text-white font-semibold flex justify-center items-center'>Confirm</button>
//                 </div>
//             </div>
//             <div
//                 ref={finishRidePanelRef}
//                 className='w-full h-4/5 py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white'>
//                 <h1
//                     onClick={(e) => {
//                         setFinishRidePanel(false)
//                     }}
//                     className='h-fit text-4xl text-center'><i className="ri-arrow-down-s-line"></i></h1>
//                 <FinishRide rideData={rideData} setFinishRidePanel={setFinishRidePanel} />
//             </div>
//         </div>
//     )
// }

// export default CaptainRiding

// import React, { useState, useEffect, useRef } from "react";
// import { logo } from "../assets";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import FinishRide from "../components/FinishRide";
// import { useLocation } from "react-router-dom";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine";
// import { useDispatch, useSelector } from "react-redux";
// import { sendMessage } from "../store/socketSlice";


// // ⭐ Fix Leaflet marker images
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";


// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });


// // ⭐ Distance function
// function getDistanceKm(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Earth radius (km)
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(lat1 * Math.PI / 180) *
//       Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) ** 2;

//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// const destinationIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });


// const CaptainRiding = () => {
//   const [finishRidePanel, setFinishRidePanel] = useState(false);
//   const [remainingDistance, setRemainingDistance] = useState(null);
//   const [captainLiveLocation, setCaptainLiveLocation] = useState(null);

//   const finishRidePanelRef = useRef(null);
//   const location = useLocation();

//   const rideData = location.state?.rideData;
//   const captainInitialLocation = location.state?.captainInitialCoords;
//   const pickupCoords = location.state?.pickupCoords;
//   const destinationCoords = location.state?.destinationCoords;
//   const hasStarted = location.state?.hasStarted;

//   const captain = useSelector((state) => state.captain.captainData);

//   const dispatch = useDispatch();

//   const mapRef = useRef(null);
//   const captainMarkerRef = useRef(null);
//   const routeRef = useRef(null);

//   // ⭐ Initialize Map
//   useEffect(() => {
//     if (mapRef.current) return;

//     mapRef.current = L.map("captain-map", {
//       zoom: 15,
//       center: [20.5937, 78.9629], // Default India center
//     });

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 20,
//     }).addTo(mapRef.current);

//     setTimeout(() => mapRef.current.invalidateSize(), 300);
//   }, []);

//   // ⭐ Place initial captain marker (VERY IMPORTANT)
// useEffect(() => {
//   if (!captainInitialLocation || !mapRef.current) return;

//   // Create marker once
//   if (!captainMarkerRef.current) {
//     captainMarkerRef.current = L.marker([
//       captainInitialLocation.lat,
//       captainInitialLocation.lng
//     ]).addTo(mapRef.current);
//   }

//   // Center map on captain initial position
//   mapRef.current.setView(
//     [captainInitialLocation.lat, captainInitialLocation.lng],
//     17
//   );
// }, [captainInitialLocation]);

// // ⭐ Add destination marker
// useEffect(() => {
//   if (!destinationCoords || !mapRef.current) return;

//   L.marker([destinationCoords.lat, destinationCoords.lng], {
//     icon: destinationIcon,
//   }).addTo(mapRef.current);
// }, [destinationCoords]);

//   // ⭐ Draw route helper
//   const drawRoute = (from, to) => {
//     if (!from || !to || !mapRef.current) return;

//     if (routeRef.current) {
//       mapRef.current.removeControl(routeRef.current);
//     }

//     routeRef.current = L.Routing.control({
//       waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
//       addWaypoints: false,
//       draggableWaypoints: false,
//       routeWhileDragging: false,
//       show: false,
//       lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
//       createMarker: () => null,
//     }).addTo(mapRef.current);

//     // hide route panel
//     const panels = document.getElementsByClassName("leaflet-routing-container");
//     if (panels.length > 0) panels[0].style.display = "none";
//   };

//   // ⭐ Draw route when screen loads
//   useEffect(() => {
//     if (!captainInitialLocation || !destinationCoords) return;
//     drawRoute(captainInitialLocation, destinationCoords);
//   }, [captainInitialLocation, destinationCoords]);

//   // ⭐ Immediately calculate distance (A → B)
//   useEffect(() => {
//     if (!captainInitialLocation || !destinationCoords) return;

//     const dist = getDistanceKm(
//       captainInitialLocation.lat,
//       captainInitialLocation.lng,
//       destinationCoords.lat,
//       destinationCoords.lng
//     );

//     setRemainingDistance(dist.toFixed(2));
//   }, [captainInitialLocation, destinationCoords]);

//   // ⭐ Captain Live GPS Tracking
//   // useEffect(() => {
//   //   if (!rideData || !captain) return;

//   //   const watchId = navigator.geolocation.watchPosition(
//   //     (pos) => {
//   //       const { latitude, longitude } = pos.coords;
//   //       setCaptainLiveLocation({ lat: latitude, lng: longitude });

//   //       // Marker update
//   //       if (!captainMarkerRef.current) {
//   //         captainMarkerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current);
//   //       } else {
//   //         captainMarkerRef.current.setLatLng([latitude, longitude]);
//   //         // captainMarkerRef.current.slideTo([latitude, longitude], {
//   //         //   duration: 500
//   //         // });

//   //       }

//   //       mapRef.current.setView([latitude, longitude]);

//   //       // Send to backend
//   //       dispatch(
//   //         sendMessage("captain-location-update", {
//   //           rideId: rideData._id,
//   //           captainId: captain._id,
//   //           lat: latitude,
//   //           lng: longitude,
//   //         })
//   //       );
//   //     },
//   //     (err) => console.log("GPS Error:", err),
//   //     { enableHighAccuracy: true }
//   //   );

//   //   return () => navigator.geolocation.clearWatch(watchId);
//   // }, [rideData, captain]);

// // ⭐ Captain Live GPS Tracking with Full Debugging


// useEffect(() => {
//   if (!rideData || !captain) {
//     alert(`DEBUG: rideData ${rideData} or captain missing ${captain}`);
//     return;
//   }

//   alert("DEBUG: watchPosition STARTED");

//   const watchId = navigator.geolocation.watchPosition(
//     (pos) => {
//       const { latitude, longitude } = pos.coords;

//       // 🔥 1. Show new GPS coordinates every time they update
//       alert(
//         "GPS UPDATE RECEIVED:\n" +
//         "Lat: " + latitude + "\n" +
//         "Lng: " + longitude + "\n" +
//         "Timestamp: " + new Date().toLocaleTimeString()
//       );

//       // 🔥 2. Check if coordinates are same as before
//       if (captainLiveLocation) {
//         const same =
//           captainLiveLocation.lat === latitude &&
//           captainLiveLocation.lng === longitude;

//         alert(
//           same
//             ? "⚠️ Coordinates SAME as last update (GPS not changing)"
//             : "✅ Coordinates CHANGED (GPS movement detected!)"
//         );
//       }

//       // Update state
//       setCaptainLiveLocation({ lat: latitude, lng: longitude });

//       // 🔥 3. Debug marker creation/update
//       if (!captainMarkerRef.current) {
//         alert("DEBUG: Creating initial captain marker");
//         captainMarkerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current);
//       } else {
//         alert("DEBUG: Updating captain marker position");
//         captainMarkerRef.current.setLatLng([latitude, longitude]);
//       }

//       // 🔥 4. Debug centering
//       alert("DEBUG: Centering map on captain");

//       mapRef.current.setView([latitude, longitude]);

//       // 🔥 5. Debug dispatch to backend
//       alert("DEBUG: Dispatching socket location update");

//       dispatch(
//         sendMessage("captain-location-update", {
//           rideId: rideData._id,
//           captainId: captain._id,
//           lat: latitude,
//           lng: longitude,
//         })
//       );
//     },

//     // Error callback
//     (err) => {
//       alert("GPS ERROR:\n" + JSON.stringify(err));
//       console.log("GPS Error:", err);
//     },

//     // High accuracy settings
//     { enableHighAccuracy: true }
//   );

//   return () => {
//     alert("DEBUG: watchPosition STOPPED");
//     navigator.geolocation.clearWatch(watchId);
//   };
// }, [rideData, captain]);



//   // ⭐ Update remaining distance EVERY 10 seconds
//   useEffect(() => {
//     if (!captainLiveLocation || !destinationCoords) return;

//     const interval = setInterval(() => {
//       const dist = getDistanceKm(
//         captainLiveLocation.lat,
//         captainLiveLocation.lng,
//         destinationCoords.lat,
//         destinationCoords.lng
//       );

//       setRemainingDistance(dist.toFixed(2));
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [captainLiveLocation, destinationCoords]);

//   // ⭐ GSAP Panel Animation
//   useGSAP(() => {
//     gsap.to(finishRidePanelRef.current, {
//       transform: finishRidePanel ? "translateY(0)" : "translateY(100%)",
//     });
//   }, [finishRidePanel]);

//   return (
//     <div className="w-full h-screen">
//       {/* Header */}
//       <div className="fixed flex items-center justify-between top-5 px-5 w-full">
//         <div className="w-20 left-7">
//           <img src={logo} alt="" />
//         </div>
//         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-gray-600">
//           <i className="text-2xl ri-login-box-line"></i>
//         </div>
//       </div>

//       {/* Live Map */}
//       <div className="w-full h-4/5" id="captain-map"></div>

//       {/* Ride Bottom Panel */}
//       <div
//         onClick={() => setFinishRidePanel(true)}
//         className="w-full min-h-1/5 px-4 bg-amber-300"
//       >
//         <h1 className="h-fit text-4xl text-center">
//           <i className="ri-arrow-up-s-line"></i>
//         </h1>

//         <div className="w-full h-full flex gap-3 items-center justify-around">
//           <h1 className="text-xl font-bold">
//             {remainingDistance !== null
//               ? `${remainingDistance} km left`
//               : "Calculating..."}
//           </h1>

//           <button className="w-[200px] h-12 rounded-xl bg-emerald-400 text-xl text-white font-semibold flex justify-center items-center">
//             Confirm
//           </button>
//         </div>
//       </div>

//       {/* Finish Ride Panel */}
//       <div
//         ref={finishRidePanelRef}
//         className="w-full h-4/5 py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white"
//       >
//         <h1
//           onClick={() => setFinishRidePanel(false)}
//           className="h-fit text-4xl text-center"
//         >
//           <i className="ri-arrow-down-s-line"></i>
//         </h1>
//         <FinishRide rideData={rideData} setFinishRidePanel={setFinishRidePanel} />
//       </div>
//     </div>
//   );
// };

// export default CaptainRiding;


import React, { useState, useEffect, useRef } from "react";
import { logo } from "../assets";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import FinishRide from "../components/FinishRide";
import { useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../store/socketSlice";


// ⭐ Fix Leaflet marker images
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


// ⭐ Distance function
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const destinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [captainLiveLocation, setCaptainLiveLocation] = useState(null);

  const finishRidePanelRef = useRef(null);
  const location = useLocation();

  const rideData = location.state?.rideData;
  const captainInitialLocation = location.state?.captainInitialCoords;
  const pickupCoords = location.state?.pickupCoords;
  const destinationCoords = location.state?.destinationCoords;
  const hasStarted = location.state?.hasStarted;

  const captain = useSelector((state) => state.captain.captainData);

  const dispatch = useDispatch();

  const mapRef = useRef(null);
  const captainMarkerRef = useRef(null);
  const routeRef = useRef(null);

  // ⭐ Initialize Map
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = L.map("captain-map", {
      zoom: 15,
      center: [20.5937, 78.9629], // Default India center
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
    }).addTo(mapRef.current);

    setTimeout(() => mapRef.current.invalidateSize(), 300);
  }, []);

  // ⭐ Place initial captain marker (VERY IMPORTANT)
useEffect(() => {
  if (!captainInitialLocation || !mapRef.current) return;

  // Create marker once
  if (!captainMarkerRef.current) {
    captainMarkerRef.current = L.marker([
      captainInitialLocation.lat,
      captainInitialLocation.lng
    ]).addTo(mapRef.current);
  }

  // Center map on captain initial position
  mapRef.current.setView(
    [captainInitialLocation.lat, captainInitialLocation.lng],
    17
  );
}, [captainInitialLocation]);

// ⭐ Add destination marker
useEffect(() => {
  if (!destinationCoords || !mapRef.current) return;

  L.marker([destinationCoords.lat, destinationCoords.lng], {
    icon: destinationIcon,
  }).addTo(mapRef.current);
}, [destinationCoords]);

  // ⭐ Draw route helper
  // const drawRoute = (from, to) => {
  //   if (!from || !to || !mapRef.current) return;

  //   if (routeRef.current) {
  //     mapRef.current.removeControl(routeRef.current);
  //   }

  //   routeRef.current = L.Routing.control({
  //     waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
  //     addWaypoints: false,
  //     draggableWaypoints: false,
  //     routeWhileDragging: false,
  //     show: false,
  //     lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
  //     createMarker: () => null,
  //   }).addTo(mapRef.current);

  //   // hide route panel
  //   const panels = document.getElementsByClassName("leaflet-routing-container");
  //   if (panels.length > 0) panels[0].style.display = "none";
  // };
const drawRoute = (from, to) => {
  if (!from || !to || !mapRef.current) return;

  // Remove old route if exists
  if (routeRef.current) {
    try {
      mapRef.current.removeControl(routeRef.current);
    } catch (_) {}
  }

  routeRef.current = L.Routing.control({
    waypoints: [
      L.latLng(from.lat, from.lng),
      L.latLng(to.lat, to.lng)
    ],
    addWaypoints: false,
    draggableWaypoints: false,
    routeWhileDragging: false,
    show: false,
    lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
    createMarker: () => null
  }).addTo(mapRef.current);

  // Hide info panel
  const panels = document.getElementsByClassName("leaflet-routing-container");
  if (panels.length > 0) panels[0].style.display = "none";
};


  // ⭐ Draw route when screen loads
  useEffect(() => {
    if (!captainInitialLocation || !destinationCoords) return;
    drawRoute(captainInitialLocation, destinationCoords);
  }, [captainInitialLocation, destinationCoords]);

  // ⭐ Immediately calculate distance (A → B)
  useEffect(() => {
    if (!captainInitialLocation || !destinationCoords) return;

    const dist = getDistanceKm(
      captainInitialLocation.lat,
      captainInitialLocation.lng,
      destinationCoords.lat,
      destinationCoords.lng
    );

    setRemainingDistance(dist.toFixed(2));
  }, [captainInitialLocation, destinationCoords]);

  // ⭐ Captain Live GPS Tracking
  // useEffect(() => {
  //   if (!rideData || !captain) return;

  //   const watchId = navigator.geolocation.watchPosition(
  //     (pos) => {
  //       const { latitude, longitude } = pos.coords;
  //       setCaptainLiveLocation({ lat: latitude, lng: longitude });

  //       // Marker update
  //       if (!captainMarkerRef.current) {
  //         captainMarkerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current);
  //       } else {
  //         captainMarkerRef.current.setLatLng([latitude, longitude]);
  //         // captainMarkerRef.current.slideTo([latitude, longitude], {
  //         //   duration: 500
  //         // });

  //       }

  //       mapRef.current.setView([latitude, longitude]);

  //       // Send to backend
  //       dispatch(
  //         sendMessage("captain-location-update", {
  //           rideId: rideData._id,
  //           captainId: captain._id,
  //           lat: latitude,
  //           lng: longitude,
  //         })
  //       );
  //     },
  //     (err) => console.log("GPS Error:", err),
  //     { enableHighAccuracy: true }
  //   );

  //   return () => navigator.geolocation.clearWatch(watchId);
  // }, [rideData, captain]);

// ⭐ Captain Live GPS Tracking with Full Debugging


useEffect(() => {
  if (!rideData || !captain) {
    alert(`DEBUG: rideData ${rideData} or captain missing ${captain}`);
    return;
  }

  alert("DEBUG: watchPosition STARTED");

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      // 🔥 1. Show new GPS coordinates every time they update
      alert(
        "GPS UPDATE RECEIVED:\n" +
        "Lat: " + latitude + "\n" +
        "Lng: " + longitude + "\n" +
        "Timestamp: " + new Date().toLocaleTimeString()
      );

      // 🔥 2. Check if coordinates are same as before
      if (captainLiveLocation) {
        const same =
          captainLiveLocation.lat === latitude &&
          captainLiveLocation.lng === longitude;

        alert(
          same
            ? "⚠️ Coordinates SAME as last update (GPS not changing)"
            : "✅ Coordinates CHANGED (GPS movement detected!)"
        );
      }

      // Update state
      setCaptainLiveLocation({ lat: latitude, lng: longitude });

      // 🔥 3. Debug marker creation/update
      if (!captainMarkerRef.current) {
        alert("DEBUG: Creating initial captain marker");
        captainMarkerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current);
      } else {
        alert("DEBUG: Updating captain marker position");
        captainMarkerRef.current.setLatLng([latitude, longitude]);
      }

      // 🔥 4. Debug centering
      alert("DEBUG: Centering map on captain");

      mapRef.current.setView([latitude, longitude]);

      // 🔥 5. Debug dispatch to backend
      alert("DEBUG: Dispatching socket location update");

      dispatch(
        sendMessage("captain-location-update", {
          rideId: rideData._id,
          captainId: captain._id,
          lat: latitude,
          lng: longitude,
        })
      );
    },

    // Error callback
    (err) => {
      alert("GPS ERROR:\n" + JSON.stringify(err));
      console.log("GPS Error:", err);
    },

    // High accuracy settings
    { enableHighAccuracy: true }
  );

  return () => {
    alert("DEBUG: watchPosition STOPPED");
    navigator.geolocation.clearWatch(watchId);
  };
}, [rideData, captain]);

// ⭐ Re-draw route whenever captain moves
useEffect(() => {
  if (!captainLiveLocation || !destinationCoords) return;

  // Redraw route from new captain location to destination
  drawRoute(
    { lat: captainLiveLocation.lat, lng: captainLiveLocation.lng },
    { lat: destinationCoords.lat, lng: destinationCoords.lng }
  );
}, [captainLiveLocation, destinationCoords]);


  // ⭐ Update remaining distance EVERY 10 seconds
  useEffect(() => {
    if (!captainLiveLocation || !destinationCoords) return;

    const interval = setInterval(() => {
      const dist = getDistanceKm(
        captainLiveLocation.lat,
        captainLiveLocation.lng,
        destinationCoords.lat,
        destinationCoords.lng
      );

      setRemainingDistance(dist.toFixed(2));
    }, 10000);

    return () => clearInterval(interval);
  }, [captainLiveLocation, destinationCoords]);

  // ⭐ GSAP Panel Animation
  useGSAP(() => {
    gsap.to(finishRidePanelRef.current, {
      transform: finishRidePanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [finishRidePanel]);

  return (
    <div className="w-full h-screen">
      {/* Header */}
      <div className="fixed flex items-center justify-between top-5 px-5 w-full">
        <div className="w-20 left-7">
          <img src={logo} alt="" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-gray-600">
          <i className="text-2xl ri-login-box-line"></i>
        </div>
      </div>

      {/* Live Map */}
      <div className="w-full h-4/5" id="captain-map"></div>

      {/* Ride Bottom Panel */}
      <div
        onClick={() => setFinishRidePanel(true)}
        className="w-full min-h-1/5 px-4 bg-amber-300"
      >
        <h1 className="h-fit text-4xl text-center">
          <i className="ri-arrow-up-s-line"></i>
        </h1>

        <div className="w-full h-full flex gap-3 items-center justify-around">
          <h1 className="text-xl font-bold">
            {remainingDistance !== null
              ? `${remainingDistance} km left`
              : "Calculating..."}
          </h1>

          <button className="w-[200px] h-12 rounded-xl bg-emerald-400 text-xl text-white font-semibold flex justify-center items-center">
            Confirm
          </button>
        </div>
      </div>

      {/* Finish Ride Panel */}
      <div
        ref={finishRidePanelRef}
        className="w-full h-4/5 py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white"
      >
        <h1
          onClick={() => setFinishRidePanel(false)}
          className="h-fit text-4xl text-center"
        >
          <i className="ri-arrow-down-s-line"></i>
        </h1>
        <FinishRide rideData={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;