import React from 'react'
import { logo, homepage_img } from '../assets/index';
import { Link } from 'react-router-dom';
const Start = () => {
    return (
        <div className="relative w-full h-full flex flex-col justify-between bg-[#f3d1d1] overflow-hidden">


            {/* Uber logo */}
            <div className="absolute top-6 left-4 text-black font-semibold text-lg z-10">
                <img className='w-20 ml-5 mt-5' src={logo} alt="" />
            </div>

            {/* Main illustration */}
            <div className="flex-grow flex items-center justify-center">
                <img
                    src={homepage_img}
                    alt="Uber Traffic Light"
                    className="w-full h-125 object-fill"
                />
            </div>

            {/* Bottom CTA section */}
            <div className=" w-full bg-white px-6 py-6 rounded-t-3xl shadow-inner text-center">
                <h2 className="text-lg font-semibold mb-4 text-black">Get started with Uber</h2>
                <Link to='/login'>
                    <button className="w-full bg-black text-white py-3 rounded-full text-base font-medium flex items-center justify-center gap-2">
                        Continue <span className="text-xl">→</span>
                    </button>
                </Link>
                <div className="w-full flex justify-center mt-5">
                    <div className="w-14 h-1 rounded-full bg-black/20"></div>
                </div>
            </div>
        </div>
    );
}

export default Start