import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRides() {
      try {
               const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/ride-history`,
          {
                      withCredentials: true,
          }
        );
        setRides(res.data.data);
      } catch (error) {
        console.log("Error fetching ride history", error);
      }
    }
    fetchRides();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white shadow-sm">
        <i
          onClick={() => navigate(-1)}
          className="ri-arrow-left-line text-2xl text-gray-700 active:scale-90"
        ></i>
        <h1 className="text-xl font-semibold">Ride History</h1>
        <div className="w-6"></div>
      </div>

      {/* Rides */}
      <div className="px-5 py-5 space-y-4">
        {rides.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No rides found</p>
        ) : (
          rides.map((ride) => (
            <div
              key={ride._id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between mb-3">
                <p className="font-semibold text-gray-800">{ride.pickup}</p>
                <span className="text-sm text-gray-500">{ride.fare}₹</span>
              </div>

              <p className="text-gray-600">{ride.destination}</p>

              <div className="mt-3 flex justify-between text-sm text-gray-500">
                <span>{new Date(ride.createdAt).toLocaleString()}</span>
                <span className="capitalize">{ride.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
