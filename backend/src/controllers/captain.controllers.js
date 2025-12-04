import Captain from "../models/Captain.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { validationResult } from "express-validator";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const captain = await Captain.findById(userId)
        console.log('captain found by id ',captain);
        const accessToken = captain.generateAccessToken()
        console.log('access token is create', accessToken);
        const refreshToken = captain.generateRefreshToken()
        console.log('generating refresh token', refreshToken);
        captain.refreshToken = refreshToken
        await captain.save({ validateBeforeSave: false })
        console.log('stored in cap',captain);
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerCaptain = asyncHandler(async (req, res) => {
    console.log('this is a controller of captain register')
    const { fullName, email, password, phone, vehicle } = req.body;
    console.log(req.body, vehicle)
    // ✅ 1. Validate required fields
    if (!fullName || !email || !password || !phone || !vehicle) {
        throw new ApiError(400, "Full name, email, phone, password, and vehicle are required");
    }

    // ✅ 2. Validate input errors (if using express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg)
        throw new ApiError(400, errors.array()[0].msg);
    }
    console.log(vehicle)
    // ✅ 3. Check if captain already exists
    const existingCaptain = await Captain.findOne({ email });
    if (existingCaptain) {
        throw new ApiError(400, "Captain with this email already exists");
    }
    console.log('captain doesnot exists', existingCaptain)

    console.log('Creating captain...');
    // ✅ 4. Create new captain — password will be hashed in schema pre-save hook
    const captain = await Captain.create({
        fullName,
        email,
        password,
        phone,
        vehicle
    });
    console.log('Created:', captain);

    console.log('captain created', captain)
    if (!captain) {
        throw new ApiError(500, "Something went wrong while creating captain");
    }

    console.log('Generating tokens...');
    // ✅ 5. Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(captain._id);
    console.log('Tokens:', accessToken, refreshToken);
    // ✅ 6. Save refresh token in DB
    captain.refreshToken = refreshToken;
    await captain.save({ validateBeforeSave: false });

    // ✅ 7. Remove sensitive fields for response
    const createdCaptain = await Captain.findById(captain._id).select("-password -refreshToken");
    console.log('created captain is', createdCaptain)
    if (!createdCaptain) {
        throw new ApiError(500, "Something went wrong while fetching created captain");
    }

    // ✅ 8. Set secure cookie for access token
    const options = {
        httpOnly: true,
        secure: true, // true if using HTTPS in production
        sameSite: "strict"
    };

    res.status(201)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(
            201,
            {
                captain: createdCaptain,
                accessToken,
            },
            "Captain registered successfully",
            true
        ));
});

const loginCaptain = asyncHandler(async (req, res) => {
    console.log('this is a controller of captain login')
    const { email, password } = req.body;
    console.log(req.body)

    // ✅ 1. Validate required fields
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // ✅ 2. Validate input errors (if using express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    // ✅ 2. Find captain by email
    const captain = await Captain.findOne({ email });
    if (!captain) {
        throw new ApiError(404, "Captain not found");
    }
    console.log('captain', captain, captain._id);
    // ✅ 3. Validate password
    const isValidPassword = await captain.isPasswordCorrect(password);
    if (!isValidPassword) {
        throw new ApiError(401, "Invalid password");
    }
    console.log('valid pass', isValidPassword)
    console.log('captain id',captain._id);
    // ✅ 4. Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(captain._id);
    console.log('accessTOKEN',accessToken);
    console.log('refreshTOKEN',refreshToken );                 
    console.log(accessToken, refreshToken)
    // ✅ 5. Save refresh token in DB
    captain.refreshToken = refreshToken;
    await captain.save({ validateBeforeSave: false });
    // ✅ 6. Set secure cookie for refresh token
    const options = {
    //     httpOnly: true,
    //     secure: false, // true if using HTTPS in production
    //     // sameSite: "strict"
    //     sameSite: "none",
    //       path: "/"     ,
    //        domain: "localhost",

     httpOnly: true,
    secure: true,      // required for SameSite=None on WebKit
    sameSite: "none",
    path: "/",
};
    
    console.log('captain', captain)
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(
            200,
            {
                captain: { _id: captain._id, fullName: captain.fullName, email: captain.email },
                accessToken
            },
            "Captain logged in successfully",
            true
        ));
}); 

const profileCaptain = asyncHandler(async (req, res) => {
    const captain = req.captain;
    if (!captain) {
        throw new ApiError(404, "Captain not found");
    }
    res.status(200).json(new ApiResponse(
        200,
        {
            captain: { _id: captain._id, fullName: captain.fullName, email: captain.email }
        },
        "Captain profile fetched successfully",
        true
    ));
});

const logOutCaptain = asyncHandler(async (req, res) => {
    console.log('this is a controller of captain logout');
    const captain = req.captain;
    // ✅ 1. Remove refresh token from DB
    captain.refreshToken = undefined;
    await captain.save({ validateBeforeSave: false });

    // 2️⃣ Blacklist current access token
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    if (token) {
        await BlackListToken.create({ token });
    }

 
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(
            200,
            {},
            "Captain logged out successfully",
            true
        )); 
})

const getCurrentCaptainData = asyncHandler(async (req, res) => {
    console.log('this is a controller of captain getcurrentuser data')
    console.log(req.captain)
    const user = req.captain;
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            { user },
            "User profile fetched successfully",
            true
        )
    );
})

export {
    registerCaptain,
    loginCaptain,
    profileCaptain,
    logOutCaptain,
    getCurrentCaptainData
};