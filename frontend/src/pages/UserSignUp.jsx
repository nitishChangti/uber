import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authService } from "../service/authService";
import { useNavigate } from "react-router-dom";
import { register as userRegisterSlice } from "../store/authSlice.js";
import { useDispatch } from "react-redux";
const UserSignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await authService.register(
        data.fullName,
        data.email,
        data.password,
        data.phoneNumber
      );
      console.log(response);
      console.log(response.data.data.createdUser);
      if (response.status === 201) {
        const userData = response.data.data.createdUser;
        dispatch(userRegisterSlice(userData));
        // alert("User created successfully");
        navigate("/home");
      } else {
        // alert("User creation failed");
        console.log("User creation failed");
        console.log(response.message);
        // Use setError from react-hook-form to set a form error
        // Example: setError('email', { type: 'manual', message: 'User creation failed' });
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

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold text-base hover:opacity-90 mt-5"
          >
            Sign Up
          </button>
        </form>

        {/* Link */}
        <p className="text-sm text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
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

export default UserSignUp;
