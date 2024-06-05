import { useEffect, useState } from "react";
import { useToken } from "./token_hooks";
import api from "../interceptor/axios_interceptor";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";

const useFilterTraining = (filters) => {
    // const [training, setTraining] = useState([]);
    // const [loadingTrainings, setLoadingTrainings] = useState(false);
    const [ccs, setCS] = useState(0);
    const [crobotics, setRobotics] = useState(0);
    const [caeromodelling, setAeromodelling] = useState(0);
    const [cdc, setDC] = useState(0);
    const { access_token } = useToken();


    // const fetchTraining = async () => {
    //     try {
    //         setLoadingTrainings(true);
    //         const response = await api({
    //             method: "GET",
    //             url: `/training/filter/`,
    //             params: {
    //                 ...filters
    //             },
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": "Bearer " + access_token
    //             }
    //         })
    //         if (response.status === 200) {
    //             setTraining(response.data);
    //             setLoadingTrainings(false);
    //         } else {
    //             message.error("Error in Filter Training");
    //             setLoadingTrainings(false);
    //         }

    //     } catch (err) {
    //         message.error(err?.message ? err?.message : "Something went wrong");
    //         setLoadingTrainings(false);
    //         console.log(err);
    //     }
    // }

    const fetchTraining = async () => {
        try {
            const response = await api({
                method: "GET",
                url: `/training/filter/`,
                params: {
                    ...filters
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            return response.data;

        } catch (err) {
            throw new Error(err?.response?.data?.message ? err?.response?.data?.message : "Something went wrong");
        }
    }

    const { refetch: refetchTraining, data: training, isLoading: loadingTrainings } = useQuery({
        queryKey: ["trainings", { ...filters }],
        queryFn: () => fetchTraining(),
        refetchOnWindowFocus: false
    })



    useEffect(() => {
        const csTrainings = training?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "COMPUTER SCIENCE");
        setCS(csTrainings);
        const roboTrainings = training?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "ROBOTICS");
        setRobotics(roboTrainings);
        const aeroTrainings = training?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "AEROMODELLING");
        setAeromodelling(aeroTrainings);
        const dcSession = training?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "DOUBT SESSION");
        setDC(dcSession);
    }, [training]);

    return { training, loadingTrainings, ccs, crobotics, caeromodelling, cdc, refetchTraining }
}

export default useFilterTraining;