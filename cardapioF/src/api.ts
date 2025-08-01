import axios from "axios";

const api = axios.create({
    baseURL: 'https://cardapio-api-1ymc.onrender.com',
    headers: {
        "Acess-Control-Allow-Origin":"*",
        'Content-Type':'application/json',
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default api;