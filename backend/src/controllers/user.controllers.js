import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { validationResult } from "express-validator";
import BlackListToken from "../models/blackListToken.models.js";


const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("this is a controller of user register");
  console.log(req.body);
  const { username, email, password, phone } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({ username, email, password, phone });
  if (!user) {
    throw new ApiError(500, "Something went wrong while creating user");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while fetching created user");
  }

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  };
  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        201,
        { createdUser, accessToken },
        "User registered successfully",
        true
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  console.log("this is a controller of user login");
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User with this email does not exist");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  console.log("access token is ", accessToken);
  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new ApiError(
      500,
      "Something went wrong while fetching logged in user"
    );
  }
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken },
        "User logged in successfully",
        true
      )
    );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, user, "User profile fetched successfully", true)
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log("this is a controller of logout user");

  // 1️⃣ Remove refreshToken from user
  console.log("before user update");
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  console.log("after user update", updatedUser);

  // 2️⃣ Blacklist current access token
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();
  console.log("token from header:", token);

  if (token) {
    console.log("before blacklist");
    try {
      await BlackListToken.create({ token });
      console.log("after blacklist (inserted new)");
    } catch (err) {
      if (err.code === 11000) {
        console.warn("Token already blacklisted");
      } else {
        console.error("Error blacklisting token:", err.message);
        return res
          .status(500)
          .json({ message: "Token blacklist failed", error: err.message });
      }
    }
  }

  // 3️⃣ Cookie options (secure in prod, not in local dev)
  // const options = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  // };
 const options = {
    httpOnly: true,
    secure: true,
  };
  console.log("finally user logged out");
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export default logoutUser;

const getCurrentUserData = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "User profile fetched successfully", true)
    );
});

const getUserRideHistory = asyncHandler(async (req, res) => {
  console.log(` this is a controller of get user ride history`);
  const userId = req.user._id;
  console.log("user is ", userId);
  const user = await User.findById(userId).populate({
    path: "rideHistory",
    populate: [{ path: "captain", select: "fullName phone vehicle" }],
    options: { sort: { createdAt: -1 } },
  });

  console.log("user history", user);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.rideHistory,
        "Ride history fetched successfully"
      )
    );
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { username, phone, email } = req.body;

  if (!username || !phone) {
    throw new ApiError(400, "Username and phone are required");
  }

  // Optional: Prevent duplicate email issue
  if (email) {
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) {
      throw new ApiError(400, "Email already in use by another account");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { username, phone, email },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Profile updated successfully", true)
    );
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  getCurrentUserData,
  getUserRideHistory,
  updateUserProfile,
};
