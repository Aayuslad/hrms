import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: 'https://server.hrms.aayushlad.online/api',
    // baseURL: 'https://hrms-server-8bba.onrender.com/api',
    // baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
