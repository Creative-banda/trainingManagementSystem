import { useEffect, useState } from "react";
import { useToken, useUserInfo } from "./token_hooks";
import api from "../utilities/axios_interceptor";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";

const useFilterTraining = () => {
    const {userInfo} = useUserInfo();
    const [filter, setFilter] = useState({ trainer: userInfo?.id, trainingStatus: "ONGOING", active: true });

    const fetchTraining = async () => {
        // console.log({...filter})
        try {
            const response = await api({
                method: "GET",
                url: "/training/filter/",
                params: { ...filter },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            throw new Error(error.message ? error.message : "Can not fetch trainings")
        }
    }

    const {data: training, isLoading: loadingTrainings, refetch: refetchTrainings} = useQuery({
        queryKey: ["filter_trainings", filter],
        queryFn: fetchTraining,
        retry: false,
        refetchOnWindowFocus: false,
    })

    return { training, refetchTrainings, loadingTrainings, filter, setFilter }
}

export default useFilterTraining;