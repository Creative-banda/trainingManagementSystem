import { useEffect, useState } from "react";
import api from "../utilities/axios_interceptor"
import { useToken, useUserInfo } from "./token_hooks";
import { message } from "antd";
import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import qs from "qs";

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

    const fetchTraining = async (params = {}) => {
        await api({
            method: 'GET',
            url: `/training/trainer/${userInfo?.id}`,
            params: { ...params },
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
    const { userInfo } = useUserInfo();
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState({
        status: "ONGOING",
        requestor: userInfo?.id,
        school: null,
        subject: null,
        active: true
    });

    const [attendanceFilter, setAttendanceFilter] = useState({ teachers: [], subject: "" })

    const [trainingBySubject, setTrainingBySubject] = useState({
        cs: [{}],
        robotics: [{}],
        aeromodelling: [{}],
        dc: [{}],
    });

    const fetchTraining = async () => {
        try {
            const response = await api({
                method: 'GET',
                url: `/training/filter/`,
                params: {
                    trainer: userInfo.id,
                    active: true
                },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            const csTraining = response.data.filter(({ trainingDetail }) => trainingDetail[0].subject === "COMPUTER SCIENCE");
            const roboticsTraining = response.data.filter(({ trainingDetail }) => trainingDetail[0].subject === "ROBOTICS");
            const aeromodellingTraining = response.data.filter(({ trainingDetail }) => trainingDetail[0].subject === "AEROMODELLING");
            const dcTraining = response.data.filter(({ trainingDetail }) => trainingDetail[0].subject === "DOUBT SESSION");

            setTrainingBySubject({
                cs: csTraining,
                robotics: roboticsTraining,
                aeromodelling: aeromodellingTraining,
                dc: dcTraining
            })
            return response.data
        } catch (error) {
            throw new Error("Error fetching training.")
        }
    }

    const fetchTrainingByRequester = async () => {
        try {
            const response = await api({
                method: 'GET',
                url: `/training/filter/`,
                params: {
                    requestor: userInfo.id,
                    active: true
                },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            throw new Error("Error fetching training.")
        }
    }

    const updateTraining = async (data, id) => {
        try {
            const response = await api({
                method: "PUT",
                url: `/training/${id}/`,
                data: data,
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            throw new Error("Failed to update the training")
        }
    }

    const requestTraining = async (data) => {
        try {
            const response = await api({
                method: "POST",
                url: `/training/request/`,
                data: data,
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            message.error("Failed to request the training")
            throw new Error("Failed to request the training")
        }
    }


    const fetchRequestedTraining = async () => {
        try {
            const response = await api({
                method: 'GET',
                url: `/training/request/`,
                params: { ...filters },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            throw new Error("Error while fetching requested Training")
        }
    }

    const updateRequestedTraining = async (data, id) => {
        try {
            const response = await api({
                method: "PATCH",
                url: `/training/request/${id}`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            console.log(response);
            return response.data
        } catch (error) {
            throw new Error("Failed to update the training")
        }
    }

    const attendance = async (teacher_id, subject) => {
        try {
            const response = await api({
                method: "GET",
                url: "/teacher/attendance/",
                params: {
                    teacher: teacher_id,
                    subject: subject
                },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                },
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            })
            console.log(response);
            console.log(attendanceFilter);
            return response.data
        } catch (error) {
            throw new Error("Error while fetching attendance")
        }
    }


    const { data: trainingsData, isLoading: loadingTraining, refetch: refetchTrainings } = useQuery({
        queryKey: ["trainings"],
        queryFn: fetchTraining,
    })


    const { mutate: updateTrainingMutate } = useMutation({
        mutationFn: ({ data, id }) => updateTraining(data, id),
        onSuccess: () => {
            message.success("Training updated successfully")
            queryClient.invalidateQueries({ queryKey: ['filter_trainings'] })
            queryClient.invalidateQueries({ queryKey: ['trainings'] })
        },
        onError: () => {
            message.error("Failed to update the training")
        }
    })


    const { data: requestedTrainings, refetch: refetchRequestedTraining } = useQuery({
        queryKey: ['requested_training', filters],
        queryFn: (filters) => fetchRequestedTraining(filters)
    })

    const { mutate: updateRequestedTrainingMutate } = useMutation({
        mutationFn: ({ data, id }) => updateRequestedTraining(data, id),
        onSuccess: () => {
            message.success("Training updated successfully")
            queryClient.invalidateQueries({ queryKey: ['requested_training'] })
        },
        onError: () => {
            message.error("Failed to update the training")
        }
    })


    const { mutate: requestTrainingMutate } = useMutation({
        mutationFn: (data) => requestTraining(data),
        onSuccess: () => {
            message.success("Training requested successfully")
            queryClient.invalidateQueries({ queryKey: ['trainings'] })
            queryClient.invalidateQueries({ queryKey: ['requested_training'] })
        }
    })

    const { data: requester_trainings, isLoading: loading } = useQuery({
        queryKey: ["training_requester"],
        queryFn: fetchTrainingByRequester,
    })

    const attendanceData = useQueries({
        queries: attendanceFilter.teachers.map(teacher => ({
            queryKey: ["attendance", teacher, attendanceFilter.subject],
            queryFn: () => attendance(teacher, attendanceFilter.subject),
            staleTime: 1000 * 60 * 5 // 5 minutes
        })),

    })


    return { trainingsData, loadingTraining, trainingBySubject, filters, setFilters, updateTrainingMutate, requestTrainingMutate, updateRequestedTrainingMutate, requestedTrainings, refetchTrainings, refetchRequestedTraining, requestTraining, loading, attendanceData, attendanceFilter, setAttendanceFilter }
}

