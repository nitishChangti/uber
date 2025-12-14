import React from "react";
import { uberCarIcon } from "../assets/index";
const ConfirmRide = ({
  setVehicleFound,
  setConfirmRidePanel,
  createRide,
  pickUp,
  destination,
  fare,
  vehicleType,
}) => {
  return (
    <div className="w-full  mt-0 py-5 flex flex-col gap-3">
      <h2 className="text-2xl font-bold">Confirm your Ride</h2>
      <div className="flex justify-center">
        <img className="w-30 object-contain h-30" src={uberCarIcon} alt="" />
      </div>
      <div className="flex items-center gap-5 px-5 py-1 border-b-1 border-gray-400">
        <h3 className="text-2xl">
          <i className="ri-map-pin-user-fill"></i>
        </h3>
        <div className="">
          <h3 className="text-xl font-semibold">562/11-A</h3>
          <p className="text-lg">{pickUp}</p>
        </div>
      </div>
      <div className="flex items-center gap-5 px-5 py-1 border-b-1 border-gray-400">
        <h3 className="text-2xl">
          <i className="ri-map-pin-2-fill"></i>
        </h3>
        <div>
          <h3 className="text-xl font-semibold">562/11-A</h3>
          <p className="text-lg">{destination}</p>
        </div>
      </div>
      <div className="flex items-center gap-5  px-5 py-1 ">
        <h3 className="text-2xl">
          <i className="ri-cash-line"></i>
        </h3>
        <div>
          <h3 className="text-xl font-semibold">
            <i className="ri-money-rupee-circle-line">{fare[vehicleType]}</i>
          </h3>
          <p className="text-lg">Cash cash</p>
        </div>
      </div>
      <button
        onClick={() => {
          setVehicleFound(true);
          setConfirmRidePanel(false);
          createRide();
        }}
        className="w-full h-12 rounded-xl bg-emerald-400 text-xl font-semibold"
      >
        Confirm
      </button>
    </div>
  );
};

export default ConfirmRide;
