import axios from 'axios';


const geocode = async (address) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(address)}&country=ca&types=address&access_token=${process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`
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
            `https://api.mapbox.com/search/geocode/v6/reverse?country=ca&limit=2&types=address&longitude=${longitude}&latitude=${latitude}&access_token=${process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export { geocode, reverseGeocode };
