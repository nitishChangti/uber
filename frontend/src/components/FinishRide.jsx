import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { driverPersonImg } from '../assets'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const FinishRide = ({ rideData }) => {
    const navigate=useNavigate();
    const endRide = async () => {
        try {
            const response = await axios.post('http://localhost:5000/rides/finish-ride', {
                rideId: rideData?._id,
            }, {    
                withCredentials: true
            });
            console.log('res of ride finished', response);
            if (response.status === 200) {
                // Handle successful ride finish (e.g., navigate to another page)
                console.log('Ride finished successfully');
                navigate('/captain-home');
            }
        } catch (error) {
            console.log('Error in finishing ride');
            console.log(error);
        }
    }
    console.log(rideData,'id of ride',rideData?._id);
    return (
        <div className='w-full mt-0 py-5 px-2 flex flex-col gap-3'>

            <h2 className='text-2xl font-bold'>Finish this Ride</h2>
            <div className='flex justify-between items-center px-4 py-2  rounded-xl bg-gray-100'>
                <div className='flex items-center gap-5'>
                    <img className=' object-cover w-12 h-12 rounded-full' src={driverPersonImg} alt="" />
                    <h1 className='text-xl font-semibold'>{rideData?.user?.username}</h1>
                </div>
                <div>
                    <h1 className='text-xl font-semibold'>2.2KM</h1>
                </div>
            </div>
            <div className='flex items-center gap-5 px-5 py-1 border-b-1 border-gray-400'>
                <h3 className='text-2xl'><i className="ri-map-pin-user-fill"></i></h3>
                <div className=''>
                    <h3 className='text-xl font-semibold'>562/11-A</h3>
                    <p className='text-lg'>{rideData?.pickup}</p>
                </div>
            </div>
            <div className='flex items-center gap-5 px-5 py-1 border-b-1 border-gray-400'>
                <h3 className='text-2xl'><i className="ri-map-pin-2-fill"></i></h3>
                <div>
                    <h3 className='text-xl font-semibold'>562/11-A</h3>
                    <p className='text-lg'>{rideData?.destination}</p>
                </div>
            </div>
            <div className='flex items-center gap-5  px-5 py-1 '>
                <h3 className='text-2xl'><i className="ri-cash-line"></i></h3>
                <div>
                    <h3 className='text-xl font-semibold'><i className="ri-money-rupee-circle-line">193.20</i></h3>
                    <p className='text-lg'>{rideData?.fare}</p>
                </div>
            </div>

            <div className='w-full flex items-center justify-between gap-5 px-2 py-1 '>

                <button
                    onClick={() => {
                        console.log('finish ride btn clicked');
                        endRide();
                    }}
                    className='w-full h-12 rounded-xl bg-emerald-400 text-xl font-semibold flex justify-center items-center'>Finish Ride</button>


            </div>
        </div>
    )
}

export default FinishRide