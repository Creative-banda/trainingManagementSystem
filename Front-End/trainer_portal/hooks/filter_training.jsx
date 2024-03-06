import { useEffect, useState } from "react";
import { useToken, useUserInfo } from "./token_hooks";
import api from "../utilities/axios_interceptor";
import { message } from "antd";

const useFilterTraining = (trainingType = null, grade = null, school = null) => {
    const [training, setTraining] = useState([]);
    const [loadingTrainings, setLoadingTrainings] = useState(false);
    const [runningSubjectTrainings, setRunningSubjectTrainings] = useState({
        computerScience: [{}],
        robotics: [{}],
        aeromodelling: [{}],
        doubtSession: [{}],
    });
    const { access_token } = useToken();
    const {userInfo} = useUserInfo();

    const fetchTraining = async () => {
        try {
            setLoadingTrainings(true);
            const response = await api({
                method: "GET",
                url: "/training/filter/",
                params: {
                    "trainers": userInfo.id,
                    "trainingStatus": "ONGOING",
                    "trainingType": trainingType,
                    "schools": school,
                    "grades": grade
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            if(response.status === 200){
                setTraining(response.data);

                const csTraining = response.data.filter((training) => training.trainingType === "COMPUTER SCIENCE");
                const roboticsTraining = response.data.filter((training) => training.trainingType === "ROBOTICS");
                const aeromodellingTraining = response.data.filter((training) => training.trainingType === "AEROMODELLING");
                const doubtSessionTraining = response.data.filter((training) => training.trainingType === "DOUBT SESSION");
                setRunningSubjectTrainings({
                    computerScience: csTraining,
                    robotics: roboticsTraining,
                    aeromodelling: aeromodellingTraining,
                    doubtSession: doubtSessionTraining
                })

                setLoadingTrainings(false);
            }

        } catch (err) {
            message.error(err?.response?.data?.message ? err?.response?.data?.message : "Something went wrong");
            setLoadingTrainings(false);
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTraining();
    }, [userInfo.id, trainingType, school, grade])

    return { training, loadingTrainings, runningSubjectTrainings }
}

export default useFilterTraining;