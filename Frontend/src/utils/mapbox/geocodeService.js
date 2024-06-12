import axios from 'axios';
import { MAPBOX_TOKEN } from './mapboxConfig.js';


const geocode = async (address) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(address)}&access_token=${MAPBOX_TOKEN}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const reverseGeocode = async (longitude, latitude) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/search/geocode/v6/reverse?country=ca&limit=2&types=address&longitude=${longitude}&latitude=${latitude}&access_token=${MAPBOX_TOKEN}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export { geocode, reverseGeocode };
