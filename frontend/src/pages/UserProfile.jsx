import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { logout as storeLogout } from "../store/authSlice";
import axios from "axios";
import { authService } from "../service/authService";
import { logout as storeUserLogout } from '../store/authSlice'
export default function Profile() {
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cardTap = { scale: 0.97 };
  const cardHover = { scale: 1.02 };

  async function logout() {
          try {
              const res = await authService.logOut();
              console.log(`res for logout`,res)
              if (res.status === 200) {
                  dispatch(storeUserLogout())
                  console.log('logout is successfull');
                  localStorage.removeItem('accessToken')
                  localStorage.removeItem('userAuth')
                  navigate('/login')
              }
          } catch (error) {
              console.log(error)
          }
      }

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white shadow-sm">
        <motion.i
          whileTap={{ scale: 0.8 }}
          onClick={() => navigate(-1)}
          className="ri-arrow-left-line text-2xl text-gray-700"
        ></motion.i>

        <h1 className="text-xl font-semibold text-gray-800">Account</h1>
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
            src={`https://ui-avatars.com/api/?name=${user?.username}&size=200&background=000&color=fff`}
            alt="profile"
            className="w-20 h-20 rounded-full shadow-md"
          />

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {user?.username}
            </h2>

            <p className="text-gray-600 text-sm">{user?.email}</p>
            <p className="text-gray-600 text-sm">{user?.phone}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-4">

          {[
            {
              label: "Edit Profile",
              icon: "ri-user-settings-line",
              route: "/edit-profile",
              action: () => navigate("/edit-profile"),
            },
            {
              label: "Ride History",
              icon: "ri-taxi-line",
              route: "/ride-history",
              action: () => navigate("/ride-history"),
            },
            {
              label: "Logout",
              icon: "ri-logout-circle-r-line",
              route: null,
              action: logout,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileTap={cardTap}
              whileHover={cardHover}
              onClick={item.action}
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

        </div>
      </div>
    </div>
  );
}
