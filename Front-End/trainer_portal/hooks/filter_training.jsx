import { useEffect, useState } from "react";
import { useToken, useUserInfo } from "./token_hooks";
import api from "../utilities/axios_interceptor";
import { message } from "antd";

const useFilterTraining = () => {
    const [training, setTraining] = useState([]);
    const [loadingTrainings, setLoadingTrainings] = useState(false);
    const {access_token} = useToken();
    // const {userInfo} = useUserInfo();

    const fetchTraining = async (filter) => {
        // console.log({...filter})
        try {
            setLoadingTrainings(true);
            const response = await api({
                method: "GET",
                url: "/training/filter/",
                params: { ...filter },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            if(response.status === 200){
                // console.log(response.data);
                setTraining(response.data);

                setLoadingTrainings(false);
            }

        } catch (err) {
            message.error(err?.response?.data?.message ? err?.response?.data?.message : "Something went wrong");
            setLoadingTrainings(false);
            console.log(err);
        }
    }

    return { training, loadingTrainings, fetchTraining }
}

export default useFilterTraining;