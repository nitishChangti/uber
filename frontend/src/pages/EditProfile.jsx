import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
export default function EditProfile() {
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveHandler = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update-profile`,
        form,
        {
          withCredentials: true,
        }
      );

      console.log("Updated User:", res.data.data);

      // Update Redux Store
      dispatch(setUser(res.data.data));

      // Optional: Show success alert
      // alert("Profile updated successfully!");
      console.log("Profile updated successfully!");

      // Redirect
      navigate("/profile");
    } catch (error) {
      console.log("Profile update error:", error);

      if (error.response?.data?.message)
        // alert(error.response.data.message);
        console.log(error.response.data.message);
      // alert("Something went wrong while updating your profile.");
      else console.log("Something went wrong while updating your profile.");
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#f9fafb] pb-10">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-5 py-4 bg-white shadow-sm"
      >
        <motion.i
          whileTap={{ scale: 0.85 }}
          onClick={() => navigate(-1)}
          className="ri-arrow-left-line text-2xl text-gray-700"
        ></motion.i>

        <h1 className="text-xl font-semibold text-gray-800">Edit Profile</h1>

        <div className="w-6"></div>
      </motion.div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center mt-6"
      >
        <motion.img
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          src={`https://ui-avatars.com/api/?name=${user?.username}&size=240&background=000&color=fff`}
          className="w-28 h-28 rounded-full shadow-lg cursor-pointer"
        />

        <p className="text-gray-500 text-sm mt-2 cursor-pointer hover:text-gray-600 transition">
          Change Photo
        </p>
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 mt-6"
      >
        {/* Input Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-5">
          {/* Username */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-[#f2f4f6] mt-1 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition"
              type="text"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#f2f4f6] mt-1 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition"
              type="email"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-[#f2f4f6] mt-1 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition"
              type="text"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          {/* Save button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={saveHandler}
            className="w-full py-3 text-lg font-semibold bg-black text-white rounded-xl shadow-md"
          >
            Save Changes
          </motion.button>

          {/* Cancel */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(-1)}
            className="w-full py-3 text-lg font-semibold bg-gray-200 text-gray-800 rounded-xl"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
