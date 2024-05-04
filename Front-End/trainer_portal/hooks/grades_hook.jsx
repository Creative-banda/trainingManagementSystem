import { useState } from "react";
import api from "../utilities/axios_interceptor";
import { useToken } from "./token_hooks";
import { message } from "antd";

export default function useGrades() {
    const [loading, setLoading] = useState(false);
    const [grades, setGrades] = useState([]);
    const {access_token} = useToken();

    const fetchGrades = async () => {
        setLoading(true);
        await api({
            method: 'GET',
            url: '/school/grades/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 200) {
                setGrades(response.data);
            }else{
                message.error(response.data.message);
            }
            setLoading(false);
        }).catch(err => {
            message.error(err.message);
            setLoading(false);
        })
    }

    return {
        loading,
        grades,
        fetchGrades
    }
}