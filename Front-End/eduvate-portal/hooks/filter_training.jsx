import { useMemo, useState } from "react";
import { useToken } from "./token_hooks";
import api from "../interceptor/axios_interceptor";
import { useQuery } from "@tanstack/react-query";

const useFilterTraining = () => {
    const [filters, setFilters] = useState({
        trainer: "", active: true, trainings__subject: "", trainingStatus: "ONGOING", subject: "", currentGrade: ""
    });

    const fetchTraining = async () => {
        try {
            const response = await api({
                method: "GET",
                url: `/training/filter/`,
                params: {
                    ...filters
                },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
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
        retry:false,
        refetchOnWindowFocus: false
    })



    const currentTrainingsData = useMemo(() => {
        const data = {
            cs: 0,
            robotics: 0,
            aeromodelling: 0,
            dc: 0
        }
        const csTrainings = training?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "COMPUTER SCIENCE");
        const roboTrainings = training?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "ROBOTICS");
        const aeroTrainings = training?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "AEROMODELLING");
        const dcSession = training?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "DOUBT SESSION");
        data.cs = csTrainings?.length;
        data.robotics = roboTrainings?.length;
        data.aeromodelling = aeroTrainings?.length;
        data.dc = dcSession?.length;
        return data;
    }, [training]);

    return { training, loadingTrainings, currentTrainingsData, refetchTraining, filters, setFilters }
}

export default useFilterTraining;