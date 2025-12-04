import React from 'react'
import { uberAutoIcon, uberCarIcon, uberMotorIcon } from '../assets'
const VehiclePanel = ({
    setVehiclePanel,
    setConfirmRidePanel,
    fare,
    createRide,
    vehicleType,
    setVehicleType
}) => {
    return (
        <>
            <h2 className='w-full text-2xl font-semibold mb-4'>Choose a Vehicle</h2>
            <div onClick={() => {
                setVehiclePanel(false)
                setConfirmRidePanel(true)
                setVehicleType('car')

            }} className='w-full flex p-4 gap-4 items-center active:border-black border-gray-300  mb-2 border-2 rounded-xl'>
                <img
                    src={uberCarIcon}
                    alt=""
                    className="w-16  h-auto object-cover "
                />
                <div className=' w-52   '>
                    <h4 className='text-lg font-bold'>UberGo <i className="ri-user-fill">4</i></h4>
                    <h5 className='text-lg font-bold'>2 mins away</h5>
                    <p className='text-sm font-medium'> affordable, compact rides</p>
                </div>
                <div className=' w-fit'>
                    <h4 className='font-semibold'> <i className="ri-money-rupee-circle-line">{fare.car}</i></h4>
                </div>
            </div>

            <div onClick={() => {
                setVehiclePanel(false)
                setConfirmRidePanel(true)
                setVehicleType('bike')
            }} className='w-full flex p-4 gap-4 items-center  active:border-black border-gray-300  mb-2 border-2 rounded-xl'>
                <img
                    src={uberMotorIcon}
                    alt=""
                    className="w-16  h-auto object-cover "
                />
                <div className=' w-52   '>
                    <h4 className='text-lg font-bold'>Moto <i className="ri-user-fill">1</i></h4>
                    <h5 className='text-lg font-bold'>3 mins away</h5>
                    <p className='text-sm font-medium'> affordable, motorcycle rides</p>
                </div>
                <div className=' w-fit'>
                    <h4 className='font-semibold'> <i className="ri-money-rupee-circle-line">{fare.bike}</i></h4>
                </div>
            </div>
            <div onClick={() => {
                setVehiclePanel(false)
                setConfirmRidePanel(true)
                setVehicleType('auto')
            }} className='w-full flex p-4 gap-4 items-center  active:border-black border-gray-300  mb-2 border-2 rounded-xl'>
                <img
                    src={uberAutoIcon}
                    alt=""
                    className="w-16  h-auto object-cover "
                />
                <div className=' w-52   '>
                    <h4 className='text-lg font-bold'>UberAuto <i className="ri-user-fill">3</i></h4>
                    <h5 className='text-lg font-bold'>3 mins away</h5>
                    <p className='text-sm font-medium'> affordable, Auto rides</p>
                </div>
                <div className=' w-fit'>
                    <h4 className='font-semibold'> <i className="ri-money-rupee-circle-line">{fare.auto}</i></h4>
                </div>
            </div>
        </>
    )
}

export default VehiclePanel