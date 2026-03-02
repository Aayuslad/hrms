import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: 'https://server.hrms.aayushlad.online/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
