import { useNavigate } from "react-router-dom";
import api from "../utilities/axios_interceptor";
import { useContext } from "react";
import { Context } from "../context/user_context";
import { useToken } from "./token_hooks";

const useLogout = () => {
    const { setIsAuthenticated, setError } = useContext(Context);
    const {access_token, refresh_token} = useToken();
    const redirect = useNavigate();

    const handleLogout = async () => {
        await api({
            method: 'POST',
            url: "/account/auth/",
            data: { refresh_token: refresh_token },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then(response => {
            console.log(response.data);
            localStorage.clear();
            setIsAuthenticated(false);
            redirect("/login");
        }).catch(error => {
            console.log(error);
            setError(error?.response?.data);
        })
    }

    return { handleLogout }
}


export default useLogout