import axios from 'axios';

const instance = axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    },
    baseURL: process.env.REACT_APP_HOST,
});

export default instance;