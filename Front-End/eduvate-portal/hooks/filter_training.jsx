import { useEffect, useState } from "react";
import { useToken } from "./token_hooks";
import api from "../interceptor/axios_interceptor";
import { message } from "antd";

const useFilterTraining = (filters) => {
    const [training, setTraining] = useState([]);
    const [loadingTrainings, setLoadingTrainings] = useState(false);
    const [ccs, setCS] = useState(0);
    const [crobotics, setRobotics] = useState(0);
    const [caeromodelling, setAeromodelling] = useState(0);
    const [cdc, setDC] = useState(0);
    const { access_token } = useToken();


    const fetchTraining = async () => {
        try {
            setLoadingTrainings(true);
            const response = await api({
                method: "GET",
                url: `/training/filter/`,
                params: {...filters},
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            if (response.status === 200) {
                setTraining(response.data);
                setLoadingTrainings(false);
            } else {
                message.error("Error in Filter Training");
                setLoadingTrainings(false);
            }

        } catch (err) {
            message.error("Error in Filter Training");
            setLoadingTrainings(false);
            console.log(err);
        }
    }


    useEffect(() => {
        fetchTraining();
    }, [])

    useEffect(() => {
        const csTrainings = training?.filter((training) => training.trainingType === "COMPUTER SCIENCE");
        setCS(csTrainings);
        const roboTrainings = training?.filter((training) => training.trainingType === "ROBOTICS");
        setRobotics(roboTrainings);
        const aeroTrainings = training?.filter((training) => training.trainingType === "AEROMODELLING");
        setAeromodelling(aeroTrainings);
        const dcSession = training?.filter((training) => training.trainingType === "DOUBT SESSION");
        setDC(dcSession);
    }, [training]);

    return { training, loadingTrainings, ccs, crobotics, caeromodelling, cdc, fetchTraining }
}

export default useFilterTraining;