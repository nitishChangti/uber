import express from 'express';
const router = express.Router();
import { query } from 'express-validator';
import { verifyJWT } from '../middlewares/verifyJwt.js';
import { getCoordinates, getDistanceTime, getCompleteSuggestions } from '../controllers/map.controllers.js';

router.route('/get-coordinates').get(
    query('address').isString().notEmpty().withMessage('Address is required').isLength({ min: 3 }),
    verifyJWT,
    getCoordinates
)

router.route('/get-distance-time').get(
    query('origin').isString().notEmpty().withMessage('Origin is required').isLength({ min: 3 }),
    query('destination').isString().notEmpty().withMessage('Destination is required').isLength({ min: 3 }),
    verifyJWT,
    getDistanceTime
)

router.route('/get-suggestions').get(
    query('input').isString().notEmpty().withMessage('Input is required').isLength({ min: 1 }),
    verifyJWT,
    getCompleteSuggestions
)

export default router;