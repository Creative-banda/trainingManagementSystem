import { useEffect, useState } from "react";
import api from "../utilities/axios_interceptor"
import { useToken, useUserInfo } from "./token_hooks";
import { message } from "antd";

const useTrainingById = (id, modal) => {
    const [fetchingTraining, setFetchingTraining] = useState(false);
    const { access_token } = useToken();
    const [trainings, setTrainings] = useState([{}])

    const fetchTrainingById = async () => {
        setFetchingTraining(true);
        await api({
            method: 'GET',
            url: `/training/${id}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {

            setTrainings(response.data);
            // console.log(response);
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setFetchingTraining(false);
        })
    }

    useEffect(() => {
        modal &&
            fetchTrainingById();
    }, [id, modal])

    return { trainings, defaultValues, fetchingTraining, setDefaultValues }
}

export default useTrainingById


export const useTrainingWithPagination = () => {
    const [trainingsData, setTrainingsData] = useState([]);
    const [loadingTraining, setLoading] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const { userInfo } = useUserInfo();

    const { access_token } = useToken();

    const fetchTraining = async (params = {}) => {
        await api({
            method: 'GET',
            url: `/training/trainer/${userInfo?.id}`,
            params: { ...params },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        })
            .then((response) => {
                setLoading(false);
                setTrainingsData(response.data?.results);
                setPagination({
                    ...pagination,
                    total: response.data?.count
                })
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchTraining({
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        });
    }, [pagination.current, pagination.pageSize])

    return { setPagination, pagination, loadingTraining, trainingsData, fetchTraining }
}


export const useTraining = () => {
    const [trainingsData, setTrainingsData] = useState([{}]);
    const [loadingTraining, setLoading] = useState(false);
    const [requestedTrainings, setRequestedTrainings] = useState([{}])

    const [trainingBySubject, setTrainingBySubject] = useState({
        cs: [{}],
        robotics: [{}],
        aeromodelling: [{}],
        dc: [{}],
    });

    const { userInfo } = useUserInfo();
    const { access_token } = useToken()

    const fetchTraining = async () => {
        setLoading(true);
        await api({
            method: 'GET',
            url: `/training/filter/`,
            params: {
                trainer: userInfo.id,
                active:true
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then((response) => {
            if (response.status === 200) {
                setTrainingsData(response.data);
                const csTraining = response.data.filter((training) => training.trainingType === "COMPUTER SCIENCE");
                const roboticsTraining = response.data.filter((training) => training.trainingType === "ROBOTICS");
                const aeromodellingTraining = response.data.filter((training) => training.trainingType === "AEROMODELLING");
                const dcTraining = response.data.filter((training) => training.trainingType === "DOUBT SESSION");

                setTrainingBySubject({
                    cs: csTraining,
                    robotics: roboticsTraining,
                    aeromodelling: aeromodellingTraining,
                    dc: dcTraining
                })

                setLoading(false);
            } else {
                setLoading(false);
                message.error("Error while fetching all trainings")
            }
        }).catch((error) => {
            setLoading(false);
            message.error(error.message ? error.message : "Error while fetching all trainings")
        })
    }

    const updateTraining = async (data, id) => {
        await api({
            method: "PUT",
            url: `/training/${id}/`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then((response) => {
            if (response.status === 202) {
                message.success("Training updated successfully");
            } else {
                message.error(response.data.message ? response.data.message : "Error while updating training");
            }
        }).catch((error) => {
            message.error(error.message ? error.message : "Error while updating training")
        })
    }

    const requestTraining = async (data) => {
        await api({
            method: "POST",
            url: `/training/request/`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then((response) => {
            if (response.status === 201) {
                message.success("Request sent successfully");
            } else {
                message.error(response.data.message ? response.data.message : "Error while sending request");
            }
        }).catch((error) => {
            message.error(error.message ? error.message : "Error while sending request")
        })
    }


    const fetchRequestedTraining = async (filters) => {
        await api({
            method: 'GET',
            url: `/training/request/`,
            params: { ...filters },
            headers: {
                "Content-Type":"application/json",
                "Authorization": "Bearer "+ access_token
            }
        }).then(response => {
            if(response.status === 200){
                setRequestedTrainings(response.data);
            }else{
                message.error(response.response.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchTraining();
    }, [userInfo?.id])

    return { trainingsData, loadingTraining, trainingBySubject, updateTraining, fetchTraining, requestTraining, fetchRequestedTraining, requestedTrainings }
}