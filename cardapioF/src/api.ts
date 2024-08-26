import axios from "axios";

const api = axios.create({
    baseURL: 'https://cardapio-api-1ymc.onrender.com',
    headers: {
        "Acess-Control-Allow-Origin":"*",
        'Content-Type':'application/json',
    }
})


export default api;