import React, { use, useEffect, useState } from 'react'
import { map, logo, uberCarIcon, uberMotorIcon, uberAutoIcon } from '../assets/index'
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { authService } from '../service/authService';
import { useDispatch } from 'react-redux';
import { login, logout as storeUserLogout, setUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom';
import { sendMessage,receiveMessage } from '../store/socketSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const { isConnected } = useSelector((state) => state.socket);
    const [isRideRequested, setIsRideRequested] = useState(false);
    const [confirmRideData, setConfirmRideData] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [pickUp, setPickUp] = useState('')
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [destination, setDestination] = useState('')
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false)
    const panelOpenRef = useRef(null)
    const panelCloseRef = useRef(null)
    const containerRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [ConfirmRidePanel, setConfirmRidePanel] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState('')
    const user = useSelector((state) => state.auth.userData);
    
    useEffect(() => {
        console.log('user before joining room');
         // ✅ Wait until user exists AND socket is connected
         console.log('user data is',user);
    if (isConnected && user && user?._id) {
      console.log("Joining socket room for user:", user._id);
      dispatch(sendMessage("join", { userType: "user", userId: user._id }));
    }
    }, [dispatch, user,isConnected]);

    useEffect(() => {
        // console.log("Socket is connected:", isConnected);
    if (!isConnected) return;
    if(isRideRequested){
        console.log('the riderequested is true');
        dispatch(
            receiveMessage("ride-confirmed", (data) => {
                console.log("🚗 Ride confirmed received from server:", data);
                setConfirmRideData(data);
                setWaitingForDriver(true);
                setIsRideRequested(false)
                setVehicleFound(false);    
            })
        )
    }

 dispatch(
         receiveMessage('ride-started', (data) => {
            console.log('🚗 Ride started received from server:', data)
            navigate('/riding', { state: { rideData: data } });
         })
    )

    }, [isConnected,isRideRequested]);
                
//    useEffect(() => {
//     if(confirmRideData && waitingForDriver){
//          console.log('this before of making payment');
//     dispatch(
//          receiveMessage('ride-started', (data) => {
//             console.log('🚗 Ride started received from server:', data)
//             navigate('/riding', { state: { rideData: data } });
//          })
//     )
//     }
//    }, [confirmRideData,waitingForDriver]);


    const onSubmitHandler = (e) => {
        e.preventDefault()
        console.log('form submitted')
    }

    // const fetchLocationSuggestions = async (input) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/maps/get-suggestions?input=${input}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)accesstoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
    //             },
    //             credentials: 'include'

    //         });
    //         const data = await response.json();
    //         console.log(data.data.suggestions);
    //         return data.data.suggestions;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // React.useEffect(() => {
    //     if (panelOpen === true) {
    //         const getSuggestions = async () => {
    //             const suggestions = await fetchLocationSuggestions(pickUp);
    //             console.log(suggestions)
    //         }
    //         getSuggestions();
    //     }
    // }, [panelOpen, pickUp]);

    useGSAP(() => {
        if (panelOpen) {
            gsap.to(panelOpenRef.current, {
                height: '70%',
                display: 'flex'
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
            gsap.to(containerRef.current, {
                top: 0,
                bottom: 'auto',
                duration: 1,
                ease: 'power2.out'
            })
        }
        else {
            gsap.to(panelOpenRef.current, {
                height: '0%',
                duration: 0.5,
                ease: 'power2.in',
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
            gsap.to(containerRef.current, {
                top: 'auto',
                bottom: 0,
            })
        }

    }, [panelOpen])

    useGSAP(() => {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        }
        else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(() => {
        if (ConfirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        }
        else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ConfirmRidePanel])


    useGSAP(() => {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        }
        else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound])

    useGSAP(() => {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        }
        else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])

    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)
        try {
              const accessToken = JSON.parse(localStorage.getItem('accessToken'));
           const res = await fetch(`http://localhost:5000/rides/get-fare?pickup=${encodeURIComponent(pickUp)}&destination=${encodeURIComponent(destination)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // ✅ Use token from localStorage
            },
            credentials: 'include' // optional if you need cookies
        });
        if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
        }

            const data = await res.json();
            console.log(data.data.fare);
            setFare(data.data.fare);
        } catch (err) {
            console.log(err);
        }
    }

    async function createRide() {
        console.log('confirm ride func is runned');
        try {
               const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    const res = await axios.post(
      'http://localhost:5000/rides/create',
      {
        pickup: pickUp,
        destination: destination,
        vehicleType: vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ attach token
          'Content-Type': 'application/json',
        },
        withCredentials: true, // optional if cookies are used
      }
    );
            console.log(res);
            setIsRideRequested(true)
        }
        catch (err) {
            console.log(err);
        }
    }
    async function logout() {
        try {
            const res = await authService.logOut();
            console.log(res)
            if (res.status === 200) {
                dispatch(storeUserLogout())
                console.log('logout is successfull');
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className=" relative w-full h-screen border-2">
            {/* <img onClick={() => {
                setVehiclePanel(false)
            }} className='w-full h-screen object-cover' src={map} alt="" /> */}
            <div className="absolute inset-0 z-0">
  <LiveTracking />
</div>


            <div className="absolute top-7 w-full px-7 flex justify-between">
                <img className='w-25' src={logo} alt="" />
                <div
                    onClick={() => {
                        logout();
                    }}
                    className='bg-white rounded-full  w-fit p-1'>
                    <i className=" items-center text-3xl ri-login-box-line"></i>
                </div>
            </div>
            <div
                ref={containerRef}
                className={`absolute ${panelOpen ? ' h-screen' : 'bottom-0 '}  bg-white w-full flex-col border-0 flex rounded-t-2xl `}>

                <div
                    className='p-5 w-full flex flex-col gap-5 h-[30%] '>
                    <h1
                        ref={panelCloseRef}
                        onClick={(e) => setPanelOpen(false)}
                        className='absolute right-10 text-3xl opacity-0'><i className="ri-arrow-down-s-line"></i></h1>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <div className='absolute w-0 h-20 top-22 left-12 rounded-full border-2'></div>
                    <form
                        onSubmit={(e) => onSubmitHandler(e)}
                        className='flex flex-col gap-4 mb-7'>
                        <input
                            value={pickUp}
                            onChange={(e) => setPickUp(e.target.value)}
                            onClick={() => setPanelOpen(true)}
                            className='w-full h-12 text-lg border-0 rounded-lg p-2 pl-15 bg-[#e8eef0f8]'
                            type="text"
                            placeholder="Search for a trip" />
                        <input
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            onClick={() => setPanelOpen(true)}
                            className='w-full h-12 text-lg border-0 rounded-lg p-2 pl-15 bg-[#e8eef0f8]'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                </div>
                <div
                    ref={panelOpenRef}
                    style={{ maxHeight: '0px' }}
                    className='w-full  bg-white hidden'>
                    <LocationSearchPanel setPanelOpen={setPanelOpen} panelOpen={panelOpen}
                        setVehiclePanel={setVehiclePanel} pickUp={pickUp} setPickUp={setPickUp}
                        selectedAddress={selectedAddress} selectedDestination={selectedDestination}
                        setSelectedDestination={setSelectedDestination} setSelectedAddress={setSelectedAddress}
                        destination={destination} setDestination={setDestination}
                        findTrip={findTrip}
                    />

                </div>
            </div>
            <div
                ref={vehiclePanelRef}
                className='w-full py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white'>
                <VehiclePanel setVehiclePanel={setVehiclePanel} setConfirmRidePanel={setConfirmRidePanel}
                    fare={fare} vehicleType={vehicleType} setVehicleType={setVehicleType} createRide={createRide} />
            </div>
            <div
                ref={confirmRidePanelRef}
                className='w-full py-0 px-4 fixed bottom-0 translate-y-full z-10 bg-white'>
                <h1
                    // ref={panelCloseRef}
                    onClick={(e) => {
                        console.log(' panel close');
                        setConfirmRidePanel(false)
                    }}
                    className='h-fit text-4xl text-center'><i className="ri-arrow-down-s-line"></i></h1>
                <ConfirmRide createRide={createRide} pickUp={pickUp} vehicleType={vehicleType} destination={destination} fare={fare} setVehicleFound={setVehicleFound} setConfirmRidePanel={setConfirmRidePanel} />
            </div>
            <div
                ref={vehicleFoundRef}
                className='w-full py-0 px-4 fixed bottom-0 translate-y-full z-10 bg-white'>
                <h1
                    // ref={panelCloseRef}
                    onClick={(e) => {
                        console.log(' panel close');
                        setVehicleFound(false)
                    }}
                    className='h-fit text-4xl text-center'><i className="ri-arrow-down-s-line"></i></h1>
                <LookingForDriver pickUp={pickUp} vehicleType={vehicleType} destination={destination} fare={fare} />
            </div>
            <div
                ref={waitingForDriverRef}
                className='w-full py-0 px-4 fixed bottom-0 translate-y-full z-10 bg-white'>
                <h1
                    // ref={panelCloseRef}
                    onClick={(e) => {
                        console.log(' panel close');
                        setWaitingForDriver(false)
                    }}
                    className='h-fit text-4xl text-center'><i className="ri-arrow-down-s-line"></i></h1>
                <WaitingForDriver confirmRideData={confirmRideData}/>
            </div>
        </div >
    )
}

export default Home