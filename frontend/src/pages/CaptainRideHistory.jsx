import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CaptainRideHistory() {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  async function fetchHistory() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/ride-history`,
        { withCredentials: true }
      );
      setRides(res.data.data);
    } catch (err) {
      console.log("Error fetching ride history", err);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white shadow-sm">
        <motion.i
          whileTap={{ scale: 0.85 }}
          onClick={() => navigate(-1)}
          className="ri-arrow-left-line text-2xl"
        ></motion.i>
        <h1 className="text-xl font-semibold">Your Rides</h1>
        <div className="w-6" />
      </div>

      <div className="p-4">
        {rides.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">
            No rides completed yet.
          </p>
        ) : (
          <div className="space-y-4">
            {rides.map((ride, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    ₹ {ride.earning?.captainShare || ride.fare}
                  </h2>
                  <span className="text-sm text-gray-600">
                    {new Date(ride.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700">
                  <strong>Pickup:</strong> {ride.pickup}
                </p>

                <p className="text-gray-700">
                  <strong>Drop:</strong> {ride.destination}
                </p>

                <div className="mt-2 text-sm text-gray-500">
                  Passenger: {ride.user?.username || "Unknown"}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
