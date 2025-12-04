import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import { authorization } from "../middlewares/roleAuth.js"
import { registerCaptain, loginCaptain, profileCaptain, logOutCaptain, getCurrentCaptainData } from '../controllers/captain.controllers.js';
router.route('/register').post(
    [
        body('fullName').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number is required'),
        body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
        body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'),
        body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
        body('vehicle.vehicleType').isIn(['car', 'bike', 'auto']).withMessage('Valid vehicle type is required')
    ],
    registerCaptain
)

router.route('/login').post(
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    loginCaptain
);

router.route('/profile').get(
    authorization('captain'),
    profileCaptain
)

router.route('/getCurrentUser').get(
    authorization('captain'),
    getCurrentCaptainData
)

router.route('/logout').get(
    authorization('captain'),
    logOutCaptain
)

export default router;