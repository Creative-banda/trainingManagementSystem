import { useEffect, useState } from "react";
import { useToken } from "./token_hooks";
import api from "../utilities/axios_interceptor";

const useFilterTraining = (userId = null, trainingType = null, grade = null, school = null) => {
    const [training, setTraining] = useState([]);
    const [loadingTrainings, setLoadingTrainings] = useState(false);
    const { access_token } = useToken();

    const fetchTraining = async () => {
        try {
            setLoadingTrainings(true);
            const response = await api({
                method: "GET",
                url: `/training/filter/?trainers=${userId}&trainingStatus=ONGOING&trainingType=${trainingType}&schools=${school}&grades=${grade}&active=true`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            setTraining(response.data);
            setLoadingTrainings(false);

        } catch (err) {
            setLoadingTrainings(false);
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTraining();
    }, [userId, trainingType, school, grade])

    return { training, loadingTrainings }
}

export default useFilterTraining;