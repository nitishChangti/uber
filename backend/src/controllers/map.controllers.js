import {asyncHandler} from "../utils/asyncHandler.js";
import axios from "axios";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiRes.js";
import {validationResult} from "express-validator";
import Captain from "../models/Captain.models.js";

// const getCoordinates = asyncHandler(async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json(
//             new ApiResponse(
//                 400,
//                 {},
//                 errors.array(),
//                 false
//             )
//         )
//     }

//     const { address } = req.query;
//     if (!address) {
//         throw new ApiError(400, "Address is required");
//     }
//     try {
//         const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//         const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {
//             // const { lat, lng } = response.data.results[0].geometry.location;
//             // res.json({ lat, lng });
//             const location = response.data.results[0].geometry.location;
//             const coordinates = {
//                 lat: location.lat,
//                 lng: location.lng
//             }
//             return res.status(200).json(
//                 new ApiResponse(
//                     200,
//                     {
//                         coordinates
//                     },
//                     "Coordinates fetched successfully",
//                     true
//                 )
//             )
//         } else {
//             throw new Error('Unable to fetch coordinates');
//         }
//     }
//     catch (error) {
//         return res.status(404).json(
//             new ApiResponse(
//                 404,
//                 {},
//                 "Unable to fetch coordinates",
//                 false
//             )
//         )
//     }
// })

// const getDistanceTime = asyncHandler(async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json(
//             new ApiResponse(
//                 400,
//                 {},
//                 errors.array(),
//                 false
//             )
//         )
//     }
//     const { origin, destination } = req.query;
//     if (!origin || !destination) {
//         throw new ApiError(400, "Origin and Destination are required");
//     }
//     try {
//         const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//         const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {
//             if (response.data.rows[0].elements[0] === 'ZERO_RESULTS') {
//                 throw new Error('No route could be found between the origin and destination');
//             }
//             const element = response.data.rows[0].elements[0];
//             if (element.status === 'OK') {
//                 const distance = element.distance.text;
//                 const duration = element.duration.text;
//                 return res.status(200).json(
//                     new ApiResponse(
//                         200,
//                         { distance, duration },
//                         "Distance and time fetched successfully",
//                         true
//                     )
//                 )
//             } else {
//                 throw new Error('Unable to fetch distance and time');
//             }
//         } else {
//             throw new Error('Unable to fetch distance and time');
//         }
//     }
//     catch (error) {
//         return res.status(404).json(
//             new ApiResponse(
//                 404,
//                 {},
//                 "Unable to fetch distance and time",
//                 false
//             )
//         )
//     }
// })

// const getCompleteSuggestions = asyncHandler(async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json(
//             new ApiResponse(
//                 400,
//                 {},
//                 errors.array(),
//                 false
//             )
//         )
//     }
//     const { input } = req.query;
//     if (!input) {
//         throw new ApiError(400, "Input or query is required");
//     }
//     try {
//         const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//         const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {
//             // const suggestions = response.data.predictions.map(prediction => prediction.description);
//             const suggestions = response.data.predictions;
//             return res.status(200).json(
//                 new ApiResponse(
//                     200,
//                     { suggestions },
//                     "Suggestions fetched successfully",
//                     true
//                 )
//             )
//         } else {
//             throw new Error('Unable to fetch suggestions');
//         }
//     }
//     catch (error) {
//         return res.status(404).json(
//             new ApiResponse(
//                 404,
//                 {},
//                 "Unable to fetch suggestions",
//                 false
//             )
//         )
//     }
// })


// ✅ Get Coordinates
const getCoordinates = asyncHandler(async (req, res) => {
    console.log('getCoordinates called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, {}, errors.array(), false));
    }

    const { address } = req.query;
    if (!address) throw new ApiError(400, "Address is required");
    console.log('Address:', address);
    try {
        const options = {
            method: 'GET',
            url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
            params: { address },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
            }
        };
        console.log('Request Options:', options);
        const response = await axios.request(options);
        console.log('API Response:', response.data);
        if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0].location;
            const coordinates = { lat: location.lat, lng: location.lng };
            console.log('Coordinates:', coordinates);
            return res.status(200).json(
                new ApiResponse(200, { coordinates }, "Coordinates fetched successfully", true)
            );
        } else {
            console.log('No results found', response);
            throw new Error("Unable to fetch coordinates");
        }
    } catch (error) {
        return res.status(404).json(new ApiResponse(404, {}, "Unable to fetch coordinates", false));
    }
});

// ✅ Get Distance & Time
const getDistanceTime = asyncHandler(async (req, res) => {
    console.log('getDistanceTime called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(new ApiResponse(400, {}, errors.array(), false));

    const { origin, destination } = req.query;
    console.log('Origin:', origin, 'Destination:', destination);
    if (!origin || !destination) throw new ApiError(400, "Origin and Destination are required");

    try {
        // 1️⃣ Geocode origin
        const geocode = async (address) => {
            const geoResp = await axios.get('https://trueway-geocoding.p.rapidapi.com/Geocode', {
                params: { address },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPID_API_KEY_MATRIX,
                    'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
                }
            });
            if (!geoResp.data.results || geoResp.data.results.length === 0) throw new Error(`Unable to geocode: ${address}`);
            const loc = geoResp.data.results[0].location;
            return `${loc.lat},${loc.lng}`;
        };

        const originCoords = await geocode(origin);
        const destinationCoords = await geocode(destination);
        console.log('Origin Coords:', originCoords, 'Destination Coords:', destinationCoords);
        // 2️⃣ Call Distance Matrix with coordinates
        const matrixResp = await axios.get('https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix', {
            params: { origins: originCoords, destinations: destinationCoords },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com'
            }
        });
        if (!matrixResp) {
            console.log('No response from Distance Matrix API', matrixResp);
        }
        console.log('Distance Matrix Response:', matrixResp.data);
        if (!matrixResp.data.distances || !matrixResp.data.durations)
            throw new Error("No distance/duration returned");

        const distance = matrixResp.data.distances[0][0] + " meters";
        const duration = Math.round(matrixResp.data.durations[0][0] / 60) + " mins";
        console.log('Distance:', distance, 'Duration:', duration);
        return res.status(200).json(
            new ApiResponse(200, { distance, duration }, "Distance and time fetched successfully", true)
        );

    } catch (error) {
        console.log(error.message);
        return res.status(404).json(new ApiResponse(404, {}, "Unable to fetch distance and time", false));
    }
});


// ✅ Get Autocomplete Suggestions
const getCompleteSuggestions = asyncHandler(async (req, res) => {
    console.log('getCompleteSuggestions called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, {}, errors.array(), false));
    }

    const { input } = req.query;
    console.log('Input:', input);
    if (!input) throw new ApiError(400, "Input or query is required");

    try {
        const options = {
            method: 'GET',
            url: 'https://trueway-places.p.rapidapi.com/FindPlaceByText',
            params: { text: input, language: 'en' },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY_SUGGESTIONS,
                'X-RapidAPI-Host': 'trueway-places.p.rapidapi.com'
            }
        };

        console.log('Request Options:', options);
        const response = await axios.request(options);

        console.log('API Response:', response.data);
        if (response.data.results && response.data.results.length > 0) {
            const suggestions = response.data.results.map(p => ({
                name: p.name,
                address: p.formatted_address,
                place_id: p.place_id,
                location: p.location
            }));
            console.log('Suggestions:', suggestions);
            return res.status(200).json(
                new ApiResponse(200, { suggestions }, "Suggestions fetched successfully", true)
            );
        } else {
            return res.status(200).json(
                new ApiResponse(200, { suggestions: [] }, "No suggestions found", true)
            );
        }
    } catch (error) {
        console.log(error.response?.status, error.response?.data || error.message);
        return res.status(404).json(new ApiResponse(404, {}, "Unable to fetch suggestions", false));
    }
});

// const getCaptainsInTheRadius = async (ltd,lng,radius) => {
//     // Implementation for getting captains in the radius
//     const captains = await Captain.find({ 
//         location: {
//             $geoWithin: {
//              $centerSphere: [[lng, ltd], radius / 6371]

//             }
//         }
//     });
//     return captains
// };

const getCaptainsInTheRadius = async (lat, lng, radius) => {
    const captains = await Captain.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius / 6371]
            }
        }
    });
    return captains;
};


export {
    getCoordinates,
    getDistanceTime,
    getCompleteSuggestions,
    getCaptainsInTheRadius
}