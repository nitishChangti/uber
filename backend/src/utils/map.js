// utils/map.js
import  axios from 'axios';

async function getCoordinatesByAddress(address) {
    if (!address) throw new Error("Address is required");

    const options = {
        method: 'GET',
        url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
        params: { address },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
        }
    };

    const response = await axios.request(options);

    if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].location;
        return { lat: location.lat, lng: location.lng };
    } else {
        throw new Error("Unable to fetch coordinates");
    }
}

export { getCoordinatesByAddress };
