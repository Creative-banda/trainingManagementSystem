import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useToken } from "../hooks/token_hooks";
const BASE_URL = import.meta.env.VITE_BASE_URL;
let isRefreshing = false;
const { access_token } = useToken();

export const isTotkenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${useToken().access_token}`
    }
})


//Axios Request interceptor

api.interceptors.request.use(
    (config) => {
        if (access_token && isTotkenExpired(access_token)) {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshToken();
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


//Axios Response interceptor

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log(`Error from Response interceptor:  ${error.code}`)
            refreshToken();
        }
        return error
    }
)

// Function for getting new access token

const refreshToken = async () => {
    const { refresh_token } = useToken();

    try {
        const response = await axios.post(`${BASE_URL}/token/refresh/`,
            {
                refresh: refresh_token
            }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Update the Authorization header for all queued requests
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    }
    catch (error) {
        console.log('Failed to access token :', error);
        localStorage.clear();
        window.location.href = "/login";

    } finally {
        isRefreshing = false;
    }
}


export default api;