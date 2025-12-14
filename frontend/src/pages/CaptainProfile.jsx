import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { captainService } from "../service/captainService";
import {
  logout as storeCaptainLogout,
  setEarnings,
} from "../store/captainAuthSlice.js";
import { useDispatch } from "react-redux";
export default function CaptainProfile() {
  const captain = useSelector((state) => state.captain.captainData);
  const earnings = useSelector((state) => state.captain.earnings);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardTap = { scale: 0.97 };
  const cardHover = { scale: 1.02 };

  async function logout() {
    try {
      const res = await captainService.logOut();
      console.log(res);
      if (res.status === 200) {
        dispatch(storeCaptainLogout());
        localStorage.removeItem("capAuth");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white shadow-sm">
        <motion.i
          whileTap={{ scale: 0.8 }}
          onClick={() => navigate(-1)}
          className="ri-arrow-left-line text-2xl text-gray-700 cursor-pointer"
        ></motion.i>

        <h1 className="text-xl font-semibold text-gray-800">Captain Account</h1>
        <div className="w-6"></div>
      </div>

      <div className="px-5 py-6">
        {/* Profile Card */}
        <motion.div
          whileTap={cardTap}
          whileHover={cardHover}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5"
        >
          <motion.img
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            src={`https://ui-avatars.com/api/?name=${captain?.fullName}&size=200&background=000&color=fff`}
            alt="profile"
            className="w-20 h-20 rounded-full shadow-md"
          />

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {captain?.fullName}
            </h2>

            <p className="text-gray-600 text-sm">{captain?.email}</p>
            <p className="text-gray-600 text-sm">{captain?.phone}</p>
          </div>
        </motion.div>

        {/* Earnings Section */}
        <motion.div
          whileTap={cardTap}
          whileHover={cardHover}
          transition={{ type: "spring", stiffness: 180 }}
          className="mt-6 bg-white p-5 rounded-2xl shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Earnings Overview
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded-xl shadow-sm text-center">
              <p className="text-gray-600 text-sm">Today</p>
              <h2 className="text-2xl font-bold text-gray-800">
                ₹{earnings?.today || 0}
              </h2>
            </div>

            <div className="bg-blue-100 p-4 rounded-xl shadow-sm text-center">
              <p className="text-gray-600 text-sm">Weekly</p>
              <h2 className="text-2xl font-bold text-gray-800">
                ₹{earnings?.weekly || 0}
              </h2>
            </div>

            <div className="bg-yellow-100 p-4 rounded-xl shadow-sm text-center">
              <p className="text-gray-600 text-sm">Monthly</p>
              <h2 className="text-2xl font-bold text-gray-800">
                ₹{earnings?.monthly || 0}
              </h2>
            </div>

            <div className="bg-purple-100 p-4 rounded-xl shadow-sm text-center">
              <p className="text-gray-600 text-sm">Total</p>
              <h2 className="text-2xl font-bold text-gray-800">
                ₹{earnings?.total || 0}
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Vehicle Card */}
        <motion.div
          whileTap={cardTap}
          whileHover={cardHover}
          transition={{ type: "spring", stiffness: 200 }}
          className="mt-6 bg-white p-5 rounded-2xl shadow-sm"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Vehicle Details
          </h3>

          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Type:</strong> {captain?.vehicle?.vehicleType}
            </p>
            <p className="text-gray-700">
              <strong>Model:</strong> {captain?.vehicle?.color}
            </p>
            <p className="text-gray-700">
              <strong>Plate Number:</strong> {captain?.vehicle?.plate}
            </p>
            <p className="text-gray-700">
              <strong>Capacity:</strong> {captain?.vehicle?.capacity} seats
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-4">
          {[
            {
              label: "Edit Profile",
              icon: "ri-user-settings-line",
              route: "/captain-edit-profile",
            },
            {
              label: "Your Rides",
              icon: "ri-taxi-line",
              route: "/captain-ride-history",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileTap={cardTap}
              whileHover={cardHover}
              onClick={() => navigate(item.route)}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <motion.i
                  whileTap={{ x: 5 }}
                  whileHover={{ x: 5 }}
                  className={`${item.icon} text-2xl text-gray-800`}
                ></motion.i>

                <p className="text-lg font-medium text-gray-800">
                  {item.label}
                </p>
              </div>

              <motion.i
                whileTap={{ x: 5 }}
                whileHover={{ x: 5 }}
                className="ri-arrow-right-s-line text-2xl text-gray-600"
              ></motion.i>
            </motion.div>
          ))}

          {/* Logout */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => logout()}
            className="bg-red-500 p-4 rounded-xl shadow-sm flex items-center justify-center cursor-pointer"
          >
            <p className="text-lg font-semibold text-white">Logout</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
