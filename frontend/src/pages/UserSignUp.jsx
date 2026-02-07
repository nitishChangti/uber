import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register as registerUserSlice } from "../store/authSlice";
import { authService } from "../service/authService";

const UserSignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const res = await authService.register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.phoneNumber
      );

      if (res?.status === 201 && res?.data?.data?.createdUser) {
        const user = res.data.data.createdUser;

        // ✅ hydrate redux auth state
        dispatch(registerUserSlice(user));

        // ✅ navigate to home after successful signup
        navigate("/home");
      } else {
        setError("root", {
          type: "manual",
          message: "User registration failed. Please try again.",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("root", {
        type: "manual",
        message:
          err?.response?.data?.message ||
          "Something went wrong while creating your account.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="mb-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-black mb-6">Uber</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Root error */}
          {errors.root && (
            <p className="text-red-500 text-xs mb-4">{errors.root.message}</p>
          )}

          {/* Full Name */}
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

          {/* Phone */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-md font-semibold text-base hover:opacity-90 mt-5 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-sm text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login here
          </Link>
        </p>

        {/* Consent */}
        <p className="text-xs text-gray-500 mt-6">
          By proceeding, you consent to receive calls, WhatsApp, or SMS messages,
          including automated messages, from Uber and its affiliates to the
          number provided.
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
