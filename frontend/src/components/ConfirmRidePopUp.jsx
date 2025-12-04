import React from 'react'
import { driverPersonImg } from '../assets/index'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const ConfirmRidePopUp = ({ setConfirmRidePopUpPanel, setRidePopUpPanel , ride}) => {
    const navigate=useNavigate();
    const submitHander=async(e)=>{
        e.preventDefault();
        // Logic to handle OTP submission can be added here
        try {
            const response = await axios.post('http://localhost:5000/rides/start-ride', {
                rideId: ride?._id,
                otp: e.target[0].value
            }, {
                withCredentials: true
            });
            console.log('res of otp sended confirm ride',response);
            if(response.status===200){
                setConfirmRidePopUpPanel(false)
                setRidePopUpPanel(false)
                navigate('/captain-riding',{ state: { rideData: response.data.data.ride } });
            }
        } catch (error) {
            console.log('Error in starting ride with OTP');
            console.log(error);
        }
    }
    return (
        <div className='w-full  mt-0 py-5 px-2 flex flex-col gap-3'>

            <h2 className='text-2xl font-bold'>Confirm this Ride to Start</h2>
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

            <div className='w-fullflex items-center justify-between gap-5 px-2 py-1 '>
                <form className='flex flex-col gap-3' onSubmit={submitHander}>
                    <input type="text" className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder='Enter OTP' />
                    <div className='flex items-center justify-between gap-5 px-2 py-1 '>

                        <button
                            
                            onClick={() => {
                                setConfirmRidePopUpPanel(false)

                            }}
                            className='w-full h-12 rounded-xl bg-emerald-400 text-xl font-semibold flex justify-center items-center'>Confirm</button>
                        <button
                            onClick={() => {
                                setConfirmRidePopUpPanel(false)
                                setRidePopUpPanel(false)
                            }}
                            className='w-full h-12 rounded-xl bg-red-500 text-xl font-semibold'>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp