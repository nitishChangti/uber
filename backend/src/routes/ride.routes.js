import express from 'express';

const router = express.Router();
import { body, query } from 'express-validator';
import { verifyJWT } from '../middlewares/verifyJwt.js';
import { createNewRide, getFareRide,confirmRide ,startRide, finishRide} from '../controllers/ride.controllers.js';
import {authorization} from '../middlewares/roleAuth.js';
router.route('/create').post(
    verifyJWT,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'bike']).withMessage('Invalid vehicle type'),
    // verifyJWT,
    createNewRide
)

router.route('/get-fare').get(
    verifyJWT,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    getFareRide
)

router.route('/confirm').post(
    authorization('captain'),
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    confirmRide
)

router.route('/start-ride').post(
    authorization('captain'),
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    body('otp').isLength({ min: 4, max: 6 }).withMessage('Invalid OTP'),
    startRide
)

router.route('/finish-ride').post(
    authorization('captain'),
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    finishRide
)

export default router;