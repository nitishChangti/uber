import { asyncHandler } from "../utils/asyncHandler.js";
import { createRide } from "../utils/ride.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiRes.js";
import { getFare } from "../utils/ride.js";
import {getCoordinatesByAddress} from "../utils/map.js";
import {getCaptainsInTheRadius} from "./map.controllers.js";
import  sendMessageToSocketId from "../socket.js";
import Ride from "../models/ride.models.js";
import User from "../models/user.models.js";
import Captain from "../models/Captain.models.js";
// Create a new ride                                                                
const createNewRide = asyncHandler(async (req, res,next) => {
    console.log('Create New Ride Request Body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { pickup, destination, vehicleType } = req.body;
        console.log('Request Body:', req.body);
        const userId = req.user.id; // Extracted from JWT by verifyJWT middleware
        console.log('User ID from JWT:', userId);
        const ride = await createRide({ userId, pickup, destination, rideType: vehicleType });
        if (!ride) {
            return res.status(400).json({ message: 'Failed to create ride' });
        }
        console.log('Ride created:', ride);
       res.status(201).json(new ApiResponse(
            201,
            { ride },
            'Ride created successfully',
            true
        ));
        console.log('pickup',pickup);
        const pickupCoordinated =await getCoordinatesByAddress(pickup);
        console.log('Pickup Coordinates:', pickupCoordinated);
        const captainsInTheRadius = await getCaptainsInTheRadius(
            pickupCoordinated.lat,
            pickupCoordinated.lng,
            150 // radius in km
        );
        console.log('Captains in the radius:', captainsInTheRadius);
        // You can now notify these captains about the new ride request
        ride.otp=""
       
const rideWithUser = await Ride.findOne({ _id: ride._id })
  .populate("user", "-password -refreshToken") // optional: hide sensitive fields
  .lean(); // makes it faster and lighter

        captainsInTheRadius.map(captain => {
            sendMessageToSocketId(captain.socketId,{
                event: 'new-ride',
                    data: rideWithUser,
            }); 
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
})
const getFareRide = asyncHandler(async (req, res) => {
    console.log('Calculating fare', req.query);
    try {
        const { pickup, destination } = req.query;
        console.log('Pickup:', pickup, 'Destination:', destination);
        if (!pickup || !destination) {
            return res.status(400).json({ message: 'Pickup and destination are required' });
        }
        // Assuming you have a function to calculate the fare
        // and it's named calculateFare (you might need to import it)
        const fare = await getFare(pickup, destination);
        console.log('Fare calculated:', fare);
        return res.status(200).json(new ApiResponse(
            200,
            { fare },
            'Fare calculated successfully',
            true
        ));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
})

const confirmRide= asyncHandler(async (req, res) => {
    console.log('Confirming ride', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    const captain = req.captain;
    console.log('captain is',captain);
    if (!rideId) {
        return res.status(400).json({ message: 'rideId is required' });
    }

     await Ride.findByIdAndUpdate(rideId, { status: 'accepted' , captain: captain._id}); 
    // const ride =await Ride.findOne( { _id: rideId }).populate("user", "-password -refreshToken")
    // Fetch ride WITH user & captain populated
    const ride = await Ride.findOne({ _id: rideId })
        .populate("user", "-password -refreshToken")
        .populate("captain", "-password -refreshToken").select('+otp'); // Include OTP field
    if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
    }
   console.log('ride is ',ride); 
    sendMessageToSocketId( ride.user.socketId,{
        event: 'ride-confirmed',
            data: ride,
    })
    console.log('ride confirm message is sending to user');
    return res.status(200).json(new ApiResponse(
        200,
        {ride},
        'Ride confirmed successfully',
        true
    ));
})

    const startRide= asyncHandler(async (req, res) => {
    console.log('Starting ride', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId, otp } = req.body;
    const captain = req.captain;
    console.log('captain is',captain);
    if (!rideId || !otp) {
        return res.status(400).json({ message: 'rideId and OTP are required' });
    }
    const ride = await Ride.findOne({
    _id: rideId,
    captain: captain._id
})
  .select('+otp')
  .populate("user", "username email phone socketId")   // include socketId
  .populate("captain", "fullName   vehicle socketId  phone"); // include socketId

    if (!ride) {
        return res.status(404).json({ message: 'Ride not found or not assigned to this captain' });
    }
    if (ride.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    ride.status = 'ongoing';
    await ride.save();
    console.log('ride start is',ride,"...."    );
    sendMessageToSocketId( ride.user.socketId,{
        event: 'ride-started',
        data: ride,
    })
    console.log('ride start message is sending to user');
    return res.status(200).json(new ApiResponse(
        200,
        {ride},
        'Ride started successfully',
        true
    ));
})
const finishRide = asyncHandler(async (req, res) => {
  console.log("Finishing ride", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;
  const captain = req.captain;

  if (!rideId) {
    return res.status(400).json({ message: "rideId is required" });
  }

  // Fetch ride
  let ride = await Ride.findOne({
    _id: rideId,
    captain: captain._id,
  })
    .populate("user", "username email phone socketId")
    .populate("captain", "fullName phone vehicle socketId");

  if (!ride) {
    return res
      .status(404)
      .json({ message: "Ride not found or not assigned to this captain" });
  }

  if (ride.status !== "ongoing") {
    return res.status(400).json({ message: "Ride is not ongoing" });
  }

  // ----------------------------------------------------
  // ⭐ EARNING LOGIC (simple & clean)
  // ----------------------------------------------------
  const fare = ride.fare;
  const commissionRate = 0.10; // 10% commission (you can change)

  const platformCommission = fare * commissionRate;
  const captainShare = fare - platformCommission;

  // store inside ride
  ride.earning = {
    captainShare,
    platformCommission,
  };

  ride.status = "completed";
  await ride.save();

  console.log("Ride finished with earnings:", ride.earning);

  // ----------------------------------------------------
  // ⭐ ADD ride to user's history
  // ----------------------------------------------------
  await User.findByIdAndUpdate(
    ride.user._id,
    { $push: { rideHistory: ride._id } },
    { new: true }
  );

  console.log("Ride added to user history");

  // ----------------------------------------------------
  // ⭐ ADD ride to captain's history & update earnings
  // ----------------------------------------------------
  await Captain.findByIdAndUpdate(
    captain._id,
    {
      $push: { rideHistory: ride._id },
      $inc: { totalEarnings: captainShare }, // add earning
    },
    { new: true }
  );

  console.log("Ride added to captain history + earnings updated");

  // ----------------------------------------------------
  // ⭐ Notify user through socket
  // ----------------------------------------------------
  try {
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-finished",
      data: ride,
    });
    console.log("Ride finish notification sent to user");
  } catch (err) {
    console.log("Socket send error:", err);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { ride },
      "Ride finished successfully",
      true
    )
  );
});



export {
    createNewRide,
    getFareRide,
    confirmRide,
    startRide,
    finishRide,
   
}