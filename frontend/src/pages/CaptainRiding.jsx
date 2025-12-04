import React, { useState } from 'react'
import { logo, map } from '../assets/index'
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import FinishRide from '../components/FinishRide';
import { useLocation } from 'react-router-dom';
const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation();
    const rideData = location.state?.rideData;

    useGSAP(() => {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        }
        else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [finishRidePanel])


    return (
        <div className='w-full h-screen'>
            <div className='fixed flex items-center justify-between top-5 px-5 w-full'>
                <div className='w-20 left-7'>
                    <img className='' src={logo} alt="" />
                </div>
                <div className='w-10 h-10 rounded-full  bg-white flex items-center justify-center shadow-gray-600 '>
                    <i className="text-2xl ri-login-box-line"></i>
                </div>
            </div>

            {/* here make h-3/5 for section2 and for section1 h-1/2  */}
            <div className='w-full h-4/5'>
                <img className='w-full h-full object-cover' src={map} alt="" />
            </div>
            {/* here make h-2/5 for section2 and for section1 h-1/2  */}
            <div
                onClick={() => {
                    setFinishRidePanel(true)
                }}
                className='w-full min-h-1/5 px-4 bg-amber-300'>
                <h1
                    onClick={(e) => {
                        setRidePopUpPanel(false)
                    }}
                    className='h-fit text-4xl text-center'><i className="ri-arrow-up-s-line"></i></h1>
                <div className='w-full h-full flex  gap-3 items-center justify-around '>
                    <h1 className='text-xl font-bold'>4 KM away</h1>
                    <button
                        to="/captain-riding"
                        onClick={() => {
                        }}
                        className='w-[200px] h-12 rounded-xl bg-emerald-400 text-xl text-white font-semibold flex justify-center items-center'>Confirm</button>
                </div>
            </div>
            <div
                ref={finishRidePanelRef}
                className='w-full h-4/5 py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white'>
                <h1
                    onClick={(e) => {
                        setFinishRidePanel(false)
                    }}
                    className='h-fit text-4xl text-center'><i className="ri-arrow-down-s-line"></i></h1>
                <FinishRide rideData={rideData} setFinishRidePanel={setFinishRidePanel} />
            </div>
        </div>
    )
}

export default CaptainRiding