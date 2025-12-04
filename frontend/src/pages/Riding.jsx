import React from 'react'
import 'remixicon/fonts/remixicon.css'
import { map, uberCarIcon } from '../assets/index'
import { useLocation } from "react-router-dom";
import { receiveMessage } from '../store/socketSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Riding = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
     const location = useLocation();
  const rideData = location.state?.rideData;

    dispatch(
        receiveMessage("ride-finished", (payload) => {
        console.log("🏁 Ride finished notification received:", payload)
        navigate('/home');
    }   )
    )

  console.log("RideData:", rideData);
  console.log("Captain:", rideData?.captain);

    return (
        <div className='w-full h-screen'>
            <div className='w-full h-1/2'>
                <img className='w-full h-full object-cover' src={map} alt="" />
            </div>
            <div className='w-full h-1/2 p-4'>
                <div className='w-full  mt-0 py-0 flex flex-col gap-3'>
                    {/* here we need to after the completion of project video about call , messages, safety,etc from uber */}
                    <div className='flex justify-between items-center '>
                        <img className='w-22 object-contain h-22' src={uberCarIcon} alt="" />
                        <div className='text-right'>
                            <h3 className='font-medium text-xl mt-1'>{rideData?.captain?.fullName}</h3>
                            <h2 className='font-semibold text-xl'>{rideData?.captain?.vehicle.plate}</h2>
                            <p className='text-sm'>Maruti Suzuki Alto</p>
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
                            <h3 className='text-xl font-semibold'><i className="ri-money-rupee-circle-line">{rideData?.fare}</i></h3>
                            <p className='text-lg'>Cash Cash</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setVehicleFound(true)
                            setConfirmRidePanel(false)
                        }}
                        className='w-full h-12 rounded-xl bg-emerald-400 text-xl font-semibold'>Make a Payment</button>
                </div>
            </div>
        </div>
    )
}

export default Riding