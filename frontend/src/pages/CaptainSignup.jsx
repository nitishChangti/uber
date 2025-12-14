import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { captainService } from "../service/captainService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register as captainRegister } from "../store/captainAuthSlice";

const CaptainSignup = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      // console.log(data);
      const response = await captainService.register(
        data.fullName,
        data.email,
        data.phoneNumber,
        data.password,
        {
          color: data.vehicleColor,
          plate: data.vehiclePlate,
          capacity: parseInt(data.vehicleCapacity, 10),
          vehicleType: data.vehicleType,
        }
      );

      // console.log(response);
      if (response.status === 201) {
        const captainData = response.data.data.captain;
        console.log(captainData);
        dispatch(captainRegister(captainData));
        navigate("/captain-home");
      } else {
        setError("root", { type: "manual", message: response.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-100 px-4">
      {/* Uber Logo */}
      <div className="mb-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-black mb-6">Uber</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Root-level error from backend */}
          {errors.root && (
            <p className="text-red-500 text-xs mb-4">{errors.root.message}</p>
          )}
          {/* Full Name Input */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            What's your name
          </label>
          <input
            {...register("fullName", { required: "Full name is required" })}
            type="text"
            placeholder="Full name"
            className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mb-4">
              {errors.fullName.message}
            </p>
          )}

          {/* Phone Input */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^\+?\d{10,14}$/,
                message: "Invalid phone number",
              },
            })}
            type="tel"
            placeholder="e.g. +91 9876543210"
            className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mb-4">
              {errors.phoneNumber.message}
            </p>
          )}

          {/* Email Input */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            What's your email
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="email@example.com"
            className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mb-4">{errors.email.message}</p>
          )}

          {/* Password Input */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter Password
          </label>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type="password"
            placeholder="password"
            className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mb-6">
              {errors.password.message}
            </p>
          )}

          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>

          <div className="flex gap-4 mb-7">
            <input
              {...register("vehicleColor", {
                required: "Vehicle color is required",
              })}
              placeholder="Vehicle Color"
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            />

            <input
              {...register("vehiclePlate", {
                required: "Vehicle plate is required",
              })}
              placeholder="Vehicle Plate"
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            />
          </div>

          <div className="flex gap-4 mb-7">
            <input
              type="number"
              {...register("vehicleCapacity", {
                required: "Vehicle capacity is required",
              })}
              placeholder="Vehicle Capacity"
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            />

            <select
              {...register("vehicleType", {
                required: "Vehicle type is required",
              })}
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold text-base hover:opacity-90"
          >
            Sign Up
          </button>
        </form>

        {/* Link */}
        <p className="text-sm text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link
            to="/Captain-login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>

        {/* Consent Text */}
        <p className="text-xs text-gray-500 mt-6">
          By proceeding, you consent to get calls, WhatsApp or SMS messages,
          including by automated means, from Uber and its affiliates to the
          number provided.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
