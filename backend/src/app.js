import express from 'express';
const app = express();

import {ApiError} from './utils/ApiError.js'
import cors from 'cors';
// app.use(cors(
//     {
//         origin: ['http://localhost:5173','https://uber-red-delta.vercel.app'],
//         // origin: '*', // Allow all origins for development, restrict in production
//         credentials: true
//     }
// ))

app.use(cors({
    origin: [
        'https://uber-seven-beta.vercel.app' ,`http://localhost:5173` // Your frontend on Vercel
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


import cookieParser from 'cookie-parser';
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import authRoutes from './routes/auth.routes.js';
import captainRoutes from './routes/captain.routes.js';
import mapRoutes from './routes/maps.routes.js';
import rideRoutes from './routes/ride.routes.js';

app.use('/users', authRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/rides', rideRoutes);
// ✅ ✅ ✅ THIS MUST BE LAST!
// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;

//     return res.status(statusCode).json({
//         success: false,
//         statusCode: statusCode,
//         message: err.message || "Internal Server Error",
//         errors: err.errors || [],
//         stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
//     });
// });

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors,
            data: err.data,
            stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
        });
    }

    // fallback for other unexpected errors
    // return res.status(500).json({
    //     success: false,
    //     statusCode: 500,
    //     message: "Internal Server Error",
    //     errors: [],
    //     stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    // });
});


// Add this route before your error handlers
app.get('/socket-health', (req, res) => {
    res.json({
        message: 'Socket.IO server is running',
        endpoint: `http://localhost:${process.env.PORT || 3000}`,
        socketPath: '/socket.io',
        transports: ['websocket', 'polling']
    });
});



export { app };