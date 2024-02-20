import { useEffect, useState } from "react";
import { useToken } from "./token_hooks";
import api from "../interceptor/axios_interceptor";
import { message } from "antd";

const useFilterTraining = (userId = null, trainingType = null, grade = null, school = null) => {
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
                url: `/training/filter/?trainers=${userId}&trainingStatus=ONGOING&trainingType=${trainingType}&schools=${school}&currentGrade=${grade}&active=true`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            if(response.status === 200){
                setTraining(response.data);
                const csTrainings = response.data.filter((training) => training.trainingType === "COMPUTER SCIENCE");
                setCS(csTrainings);
                const roboTrainings = response.data.filter((training) => training.trainingType === "ROBOTICS");
                setRobotics(roboTrainings);
                const aeroTrainings = response.data.filter((training) => training.trainingType === "AEROMODELLING");
                setAeromodelling(aeroTrainings);
                const dcSession = response.data.filter((training) => training.trainingType === "DOUBT SESSION");
                setDC(dcSession);

                setLoadingTrainings(false);
            }else{
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
    }, [userId, trainingType, school, grade])

    return { training, loadingTrainings, ccs, crobotics, caeromodelling, cdc }
}

export default useFilterTraining;