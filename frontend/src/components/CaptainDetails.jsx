import React from 'react';
import { driverPersonImg } from '../assets/index';
// import { captain } from '../store/store.js';

import { useSelector } from 'react-redux';
function CaptainDetails({todayEarnings}) {

    const captainData = useSelector((state) => state.captain.captainData);
      const earnings = useSelector((state) => state.captain.earnings);
    const displayTodayEarning = earnings.today !='undefined'?earnings.today  :todayEarnings;
    console.log("Captain Data from Redux:", captainData);

    return (
        <div>
            <div className='w-full mt-0 py-0 flex flex-col gap-5 '>
                {/* here we need to after the completion of project video about call , messages, safety,etc from uber */}

                <div className='flex justify-between items-center gap-5  py-1'>
                    <div className='flex items-center gap-5 px-5 py-1'>
                        <img className=' object-cover w-12 h-12 rounded-full' src={driverPersonImg} alt="" />
                        <h1 className='text-xl font-semibold'>{captainData.fullName}</h1>
                    </div>
                    <div>
                        <i className="ri-money-rupee-circle-fill text-xl font-semibold">{displayTodayEarning}</i>
                        <p>Earned</p>
                    </div>
                </div>
                <div className='bg-zinc-100  flex justify-between items-center gap-3  py-4 px-3 rounded-2xl border-2 border-zinc-100 shadow-3xl '>
                    <div className='text-center'>
                        <i className="ri-timer-2-line text-4xl"></i>
                        <h2 className='text-xl font-semibold'>10.2</h2>
                        <p>Hours Online</p>
                    </div>
                    <div className='text-center'>
                        <i className="ri-speed-up-line text-4xl"></i>
                        <h2 className='text-xl font-semibold'>10.2</h2>
                        <p>Hours Online</p>
                    </div>
                    <div className='text-center'>
                        <i className="ri-booklet-line text-4xl"></i>
                        <h2 className='text-xl font-semibold'>10.2</h2>
                        <p className=''>Hours Online</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CaptainDetails;