import User from '../models/user.models.js';
import Captain from '../models/Captain.models.js';
import Jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js"
import BlackListToken from '../models/blackListToken.models.js';
const authorization = (allowedRoles) => {
    return async (req, res, next) => {
        console.log(allowedRoles, allowedRoles.includes('captain'), allowedRoles.includes('user'))
        try {
            console.log('req of cookies',req.cookies );
            // Get token from cookie or Authorization header (remove "Bearer " prefix)
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

            if (!token) {
                return res.status(401).json(
                    new ApiError(401, "Unauthorized request")
                );
            }

            console.log('token is', token);
            // Check if token is blacklisted
            const isBlacklisted = await BlackListToken.findOne({ token });
            if (isBlacklisted) { 
                return res.status(401).json(
                    new ApiError(401, "Unauthorized User")
                );
            }
            // Verify token
            const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log('decoded token is', decodedToken);

            if (allowedRoles.includes('user')) {
                const user = await User.findById(decodedToken?.userId).select("-otp -refreshToken");
                if (!user) {
                    return res.status(401).json(
                        new ApiError(401, "Invalid Access Token")
                    );
                }
                req.user = user;
                console.log('here authorization is done based on roles provided access to the route', user);
                if (!allowedRoles.includes(user.role)) {
                    return res.status(403).json(
                        new ApiError(403, "Forbidden")
                    );
                }
            }
            else if (allowedRoles.includes('captain')) {
                const captain = await Captain.findById(decodedToken?._id).select("-refreshToken");
                if (!captain) {
                    return res.status(401).json(
                        new ApiError(401, "Invalid Access Token")
                    );
                }
                req.captain = captain;
                console.log('here authorization is done based on roles provided access to the route', req.captain);
                // if (!allowedRoles.includes(captain.role)) {
                //     return res.status(403).json(
                //         new ApiError(403, "Forbidden")
                //     );
                // }
            } else {
                return res.status(403).json(
                    new ApiError(403, "Forbidden")
                );
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export { authorization }