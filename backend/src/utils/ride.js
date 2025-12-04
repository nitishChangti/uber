import Ride from "../models/ride.models.js";
import axios from "axios";

const getDistanceTime = async (origin, destination) => {
    console.log('Calculating distance and time from', origin, 'to', destination);
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

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
            if (!geoResp.data.results || geoResp.data.results.length === 0)
                throw new Error(`Unable to geocode: ${address}`);
            const loc = geoResp.data.results[0].location;
            return `${loc.lat},${loc.lng}`;
        };

        const originCoords = await geocode(origin);
        const destinationCoords = await geocode(destination);
        console.log('Origin Coords:', originCoords, 'Destination Coords:', destinationCoords);

        // 2️⃣ Call Distance Matrix
        const matrixResp = await axios.get('https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix', {
            params: { origins: originCoords, destinations: destinationCoords },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com'
            }
        });

        console.log('Distance Matrix Response:', matrixResp.data);

        if (!matrixResp.data.distances || !matrixResp.data.durations)
            throw new Error("No distance/duration returned");

        const distance = matrixResp.data.distances[0][0]; // meters (number)
        const duration = matrixResp.data.durations[0][0]; // seconds (number)

        console.log('Distance:', distance, 'meters | Duration:', duration, 'seconds');
        return { distance, duration };

    } catch (error) {
        console.log(error.message);
        throw new Error("Unable to fetch distance and time");
    }
};


const getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required to calculate fare');
    }

    const distanceTime = await getDistanceTime(pickup, destination);
    console.log('distanceTime:', distanceTime);

    const baseFare = {
        auto: 30,
        car: 50,
        bike: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        bike: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        bike: 1
    };

    const fare = {
        auto: Math.round(
            baseFare.auto +
            (distanceTime.distance / 1000) * perKmRate.auto +   // distance in km
            (distanceTime.duration / 60) * perMinuteRate.auto   // duration in minutes
        ),
        car: Math.round(
            baseFare.car +
            (distanceTime.distance / 1000) * perKmRate.car +
            (distanceTime.duration / 60) * perMinuteRate.car
        ),
        bike: Math.round(
            baseFare.bike +
            (distanceTime.distance / 1000) * perKmRate.bike +
            (distanceTime.duration / 60) * perMinuteRate.bike
        )
    };


    console.log('Calculated fare:', fare);
    return fare;
};

const createRide = async ({ userId, pickup, destination, rideType }) => {
    console.log('Creating ride for user:', userId, 'from', pickup, 'to', destination, 'with type', rideType);
    if (!userId || !pickup || !destination || !rideType) {
        throw new Error('All fields are required to create a ride');
    }

    const fare = await getFare(pickup, destination);
    console.log('Fare for the ride:', fare);
    const ride = {
        user: userId, // match schema field name
        pickup,
        destination,
        fare: fare[rideType],
        otp: Math.floor(1000 + Math.random() * 9000) // 4-digit OTP
    };

    console.log('Creating ride with data:', ride);
    const createdRide = await Ride.create(ride);
    console.log('Ride created successfully:', createdRide);
    return createdRide;
}


export {
    getFare,
    createRide
}