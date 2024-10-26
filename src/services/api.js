import axios from 'axios';

const API_URL = 'https://docs.google.com/spreadsheets/d/1kSPSZBs3W07SRWIiZtbyY9w2DKRmklFu63OrafLC_QY/edit?gid=897160883#gid=897160883';

export const fetchData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Add more functions for POST, PUT, DELETE as needed
