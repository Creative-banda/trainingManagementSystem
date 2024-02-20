import { useEffect, useState } from "react";
import api from "../utilities/axios_interceptor"
import { useToken, useUserInfo } from "./token_hooks";

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


export const useTrainings = () => {
    const [trainingsData, setTrainingsData] = useState([]);
    const [loadingTraining, setLoading] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const {userInfo} = useUserInfo();

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

    return { setPagination, pagination, loadingTraining, trainingsData, fetchTraining  }
}
