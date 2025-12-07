import React, { useState } from 'react'
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import 'remixicon/fonts/remixicon.css'
import { map, uberCarIcon, logo, driverPersonImg } from '../assets/index'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { sendMessage,receiveMessage } from '../store/socketSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import {logout as storeCaptainLogout} from '../store/captainAuthSlice.js';
import {captainService} from '../service/captainService.jsx'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const CaptainHome = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
    const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
    const ridePopUpPanelRef = useRef(null)
    const confirmRidePopUpPanelRef = useRef(null)
    const [ride, setRide] = useState(null);
    const captain = useSelector((state) => state.captain.captainData);
    const { isConnected } = useSelector((state) => state.socket);

    useEffect(() => {
        if (!captain?._id) return;
  
        if (isConnected) {
            console.log("✅ Joining socket room for captain:", captain._id);
            dispatch(sendMessage("join", { userType: "captain", userId: captain._id }));
        } else {
            console.log("⏳ Waiting for socket connection or captain data...");
        }
        // ✅ Listen for incoming rides
        //   console.log("✅ Socket ready. Listening for new rides...");
        //   dispatch(
        //     receiveMessage("new-ride", (payload) => {
        //       console.log("🚗 New ride received from server:", payload);
        //       // You can trigger a popup, sound, or state update here
        //     })
        //   );
        if (!navigator.geolocation) {
            console.error("❌ Geolocation not supported");
            return;
        }

        const updateLocation = () => {
            navigator.geolocation.getCurrentPosition((position) => {
            console.log("📍 Location retrieved:", position.coords);

            const data = {
                userId: captain._id,
                location: {
                    type: "Point",
                    coordinates: [position.coords.longitude, position.coords.latitude],
                },
            };
            console.log("📤 Sending location update:", data);
            dispatch(sendMessage("update-location-captain", data));
        });
    };

    const locationInterval = setInterval(updateLocation, 10000);
      updateLocation();

    return () => clearInterval(locationInterval); // ✅ cleanup to prevent memory leaks



}, [isConnected, captain, dispatch]);

// 👇 separate effect, not mixed with location/join logic
useEffect(() => {
  if (!isConnected) return;
  console.log("✅ Socket ready. Listening for new rides...");

  dispatch(
    receiveMessage("new-ride", (data) => {
      console.log("🚗 New ride received from server:", data);
        setRide(data);
        setRidePopUpPanel(true);
      alert("🚕 New ride received!"); // test visual cue
    })
  );
}, [isConnected, dispatch]);

    // const captainData = useSelector((state) => state.captain.captainData);

    // console.log("Captain Data from Redux:", captainData);

    useGSAP(() => {
        if (ridePopUpPanel) {
            gsap.to(ridePopUpPanelRef.current, {
                transform: 'translateY(0)'
            })
        }
        else {
            gsap.to(ridePopUpPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopUpPanel])

    useGSAP(() => {
        if (confirmRidePopUpPanel) {
            gsap.to(confirmRidePopUpPanelRef.current, {
                transform: 'translateY(0)'
            })
        }
        else {
            gsap.to(confirmRidePopUpPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopUpPanel])

    async function logout() {
        try {
            const res = await captainService.logOut();
            console.log(res)
            if (res.status === 200) {
                dispatch(storeCaptainLogout())
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function confirmRide() {
        try {
            console.log('this is a confirm func is being called');
            const res= await axios.post( `${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride._id,
                captainId: captain._id,
            } , {
                withCredentials: true
            }            );
            console.log(res)
        }
        catch (error) {
            console.log('the error in confirm ride func');
            console.log(error)
        }
    }

    return (
        <div className='w-full h-screen'>
            <div className='fixed flex items-center justify-between top-5 px-5 w-full'>
                <div className='w-20 left-7'>
                    <img className='' src={logo} alt="" />
                </div>
                <div
                onClick={() => {
                        logout();
                    }}
                className='w-10 h-10 rounded-full  bg-white flex items-center justify-center shadow-gray-600 '>
                    <i className="text-2xl ri-login-box-line"></i>
                </div>
            </div>

            {/* here make h-3/5 for section2 and for section1 h-1/2  */}
            <div className='w-full h-3/5'>
                <img className='w-full h-full object-cover' src={map} alt="" />
            </div>
            {/* here make h-2/5 for section2 and for section1 h-1/2  */}
            <div className='w-full h-2/5 p-4'>
                <CaptainDetails />
            </div>
            <div
                ref={ridePopUpPanelRef}
                className='w-full py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white'>
                <h1
                    onClick={(e) => {
                        setRidePopUpPanel(false)
                    }}
                    className='h-fit text-4xl text-center'><i className="ri-arrow-down-s-line"></i></h1>
                <RidePopUp 
                ride={ride}
                setRidePopUpPanel={setRidePopUpPanel} 
                setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
                    confirmRide={confirmRide}
                />
            </div>

            <div
                ref={confirmRidePopUpPanelRef}
                className='w-full h-screen py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white'>
                <h1
                    // onClick={(e) => {
                    //     setConfirmRidePopUpPanel(false)
                    // }}
                    className='h-fit text-4xl text-center'><i className="ri-arrow-down-s-line"></i></h1>
                <ConfirmRidePopUp   ride={ride} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel} />
            </div>

        </div>
    )
}

export default CaptainHome