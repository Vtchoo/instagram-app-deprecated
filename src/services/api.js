import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://192.168.0.15:3000/',
    baseURL:'http://instagramvt.ddns.net:3000',
});

export default api;