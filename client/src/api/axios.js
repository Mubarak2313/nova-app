import axios from "axios"

const api = axios.create({
    baseURL: "https://nova-app-three-iota.vercel.app/api",
});
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("nova_token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})
export default api