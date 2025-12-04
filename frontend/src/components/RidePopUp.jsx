import React from 'react'
import { driverPersonImg, uberCarIcon } from '../assets/index'
const RidePopUp = ({ ride,setRidePopUpPanel, setConfirmRidePopUpPanel ,confirmRide}) => {
    console.log(ride);
    return (
        <div className='w-full  mt-0 py-5 px-2 flex flex-col gap-3'>

            <h2 className='text-2xl font-bold'>New Ride Available</h2>
            <div className='flex justify-between items-center px-4 py-2  rounded-xl bg-gray-100'>
                <div className='flex items-center gap-5'>
                    <img className=' object-cover w-12 h-12 rounded-full' src={driverPersonImg} alt="" />
                    <h1 className='text-xl font-semibold'>{ride?.user.username}</h1>
                </div>
                <div>
                    <h1 className='text-xl font-semibold'>2.2KM</h1>
                </div>
            </div>
            <div className='flex items-center gap-5 px-5 py-1 border-b-1 border-gray-400'>
                <h3 className='text-2xl'><i className="ri-map-pin-user-fill"></i></h3>
                <div className=''>
                    <h3 className='text-xl font-semibold'>562/11-A</h3>
                    <p className='text-lg'>{ride?.pickup}</p>
                </div>
            </div>
            <div className='flex items-center gap-5 px-5 py-1 border-b-1 border-gray-400'>
                <h3 className='text-2xl'><i className="ri-map-pin-2-fill"></i></h3>
                <div>
                    <h3 className='text-xl font-semibold'>562/11-A</h3>
                    <p className='text-lg'>{ride?.destination}</p>
                </div>
            </div>
            <div className='flex items-center gap-5  px-5 py-1 '>
                <h3 className='text-2xl'><i className="ri-cash-line"></i></h3>
                <div>
                    <h3 className='text-xl font-semibold'><i className="ri-money-rupee-circle-line">{ride?.fare}</i></h3>
                    <p className='text-lg'>Cash Cash</p>
                </div>
            </div>
            <div className='flex items-center justify-between gap-5 px-2 py-1 '>
                <button
                    onClick={() => {
                        setConfirmRidePopUpPanel(true)
                        setRidePopUpPanel(false)
                        confirmRide()
                    }}
                    className='w-full h-12 rounded-xl bg-emerald-400 text-xl font-semibold'>Accept</button>
                <button
                    onClick={() => {
                        setRidePopUpPanel(false)
                    }}
                    className='w-full h-12 rounded-xl bg-gray-300 text-xl font-semibold'>Ignore</button>
            </div>
        </div>
    )
}

export default RidePopUp