import React from 'react';
import { uberCarIcon } from '../assets/index';
function WaitingForDriver({confirmRideData}) {
    return (
        <div className='w-full  mt-0 py-5 flex flex-col gap-3'>
            {/* here we need to after the completion of project video about call , messages, safety,etc from uber */}
            <div className='flex justify-between items-center '>
                <img className='w-25 object-contain h-25' src={uberCarIcon} alt="" />
                <div className='text-right'>
                    <h3 className='font-medium text-xl'>{confirmRideData?.captain?.fullName}</h3>
                    <h2 className='font-semibold text-2xl'>{confirmRideData?.captain?.vehicle?.plate}</h2>
                    <p >{confirmRideData?.captain?.vehicle?.vehicleType}</p>
                    <h2 className='font-semibold text-md'>OTP : {confirmRideData?.otp}</h2>
                </div>
            </div>
            <div className='flex items-center gap-5 px-5 py-1 border-b-1 border-gray-400'>
                <h3 className='text-2xl'><i className="ri-map-pin-user-fill"></i></h3>
                <div className=''>
                    <h3 className='text-xl font-semibold'>562/11-A</h3>
                    <p className='text-lg'>{confirmRideData?.pickup}</p>
                </div>
            </div>
            <div className='flex items-center gap-5 px-5 py-1 border-b-1 border-gray-400'>
                <h3 className='text-2xl'><i className="ri-map-pin-2-fill"></i></h3>
                <div>
                    <h3 className='text-xl font-semibold'>562/11-A</h3>
                    <p className='text-lg'>{confirmRideData?.destination}</p>            
                </div>
            </div>
            <div className='flex items-center gap-5  px-5 py-1 '>
                <h3 className='text-2xl'><i className="ri-cash-line"></i></h3>
                <div>
                    <h3 className='text-xl font-semibold'><i className="ri-money-rupee-circle-line">{confirmRideData?.fare}</i></h3>
                    <p className='text-lg'>Cash Cash</p>
                </div>
            </div>

        </div>
    );
}

export default WaitingForDriver;