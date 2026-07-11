import axios from 'axios';

const API = axios.create({
    baseURL: 'http://65.2.25.61:5000/api',
});

export default API;