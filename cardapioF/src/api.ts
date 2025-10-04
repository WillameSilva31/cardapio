import axios from "axios";

const api = axios.create({
    baseURL: 'https://cardapio-fullstack.onrender.com',
    headers: {
        "Access-Control-Allow-Origin":"*",
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Token inválido ou expirado');
            localStorage.clear();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);


export default api;