import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCaptain } from "../store/captainAuthSlice";

export default function CaptainEditProfile() {
  const captain = useSelector((state) => state.captain.captainData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullName: captain?.fullName || "",
    email: captain?.email || "",
    phone: captain?.phone || "",
    vehicleType: captain?.vehicle?.vehicleType || "",
    color: captain?.vehicle?.color || "",
    plate: captain?.vehicle?.plate || "",
    capacity: captain?.vehicle?.capacity || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function saveHandler() {
    try {
      console.log(form);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/captains/update-profile`,
        form,
        { withCredentials: true }
      );

      if (res.status === 200) {
        // UPDATE REDUX STORE
        console.log("res", res.data.data);
        const updatedCaptain = res.data.data;
        dispatch(setCaptain(updatedCaptain));

        // alert("Profile Updated Successfully");
        console.log("Profile Updated Successfully");
        navigate("/captain-profile");
      }
    } catch (error) {
      console.error("Update failed:", error);
      // alert("Profile update failed. Try again.");
      console.log("Profile update failed. Try again.");
    }
  }

  const cardAnim = { type: "spring", stiffness: 180 };

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white shadow-sm">
        <motion.i
          whileTap={{ scale: 0.8 }}
          onClick={() => navigate(-1)}
          className="ri-arrow-left-line text-2xl text-gray-700 cursor-pointer"
        ></motion.i>

        <h1 className="text-xl font-semibold text-gray-800">Edit Profile</h1>

        <div className="w-6"></div>
      </div>

      <div className="p-5">
        {/* Profile Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={cardAnim}
          className="flex flex-col items-center mt-3 mb-5"
        >
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.2 }}
            src={`https://ui-avatars.com/api/?name=${captain?.fullName}&size=200&background=000&color=fff`}
            className="w-24 h-24 rounded-full shadow-md border-2 border-white"
          />
          <p className="mt-2 text-gray-600 text-sm">Update your information</p>
        </motion.div>

        {/* Form */}
        <div className="space-y-4">
          {[
            { label: "Full Name", name: "fullName" },
            { label: "Email", name: "email" },
            { label: "Phone Number", name: "phone" },
          ].map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <label className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white shadow-sm border focus:ring-2 focus:ring-black outline-none"
                type="text"
              />
            </motion.div>
          ))}

          {/* Vehicle Details Section */}
          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            Vehicle Info
          </h2>

          {[
            { label: "Vehicle Type", name: "vehicleType" },
            { label: "Color", name: "color" },
            { label: "Plate Number", name: "plate" },
            { label: "Capacity", name: "capacity" },
          ].map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <label className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white shadow-sm border focus:ring-2 focus:ring-black outline-none"
                type="text"
              />
            </motion.div>
          ))}
        </div>

        {/* Save Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={saveHandler}
          className="w-full mt-7 bg-black text-white py-3 rounded-xl text-lg font-semibold shadow-lg"
        >
          Save Changes
        </motion.button>
      </div>
    </div>
  );
}
