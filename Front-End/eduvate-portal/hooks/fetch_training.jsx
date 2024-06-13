import { useState } from "react";
import api from "../interceptor/axios_interceptor";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToken } from "./token_hooks";

// const useTrainingById = (id, modal) => {
//     const [fetchingTraining, setFetchingTraining] = useState(false);
//     const [defaultValues, setDefaultValues] = useState({
//         defaultTrainers: [],
//         defaultGrades: [],
//         defaultSchools: [],
//         currentGrade: {}
//     });
//     const [trainings, setTrainings] = useState([{}])

//     const fetchTrainingById = async () => {
//         setFetchingTraining(true);
//         await api({
//             method: 'GET',
//             url: `/training/${id}/`,
//             // headers: {
//             //     'Content-Type': 'application/json',
//             //     'Authorization': 'Bearer ' + access_token
//             // }
//         }).then(response => {
//             const trainers = response?.data?.trainers?.map(trainer => ({
//                 label: trainer.username,
//                 value: trainer.id
//             }));

//             const grades = response?.data?.grades?.map(grade => ({
//                 label: grade?.grades,
//                 value: grade?.id
//             }))

//             const schools = response?.data?.schools?.map(school => ({
//                 label: school?.name,
//                 value: school?.id
//             }))

//             const currentGrade = {
//                 label: response?.data?.currentGradeDetails?.grades,
//                 value: response?.data?.currentGradeDetails?.id
//             }
//             setDefaultValues({
//                 defaultGrades: grades,
//                 defaultSchools: schools,
//                 defaultTrainers: trainers,
//                 currentGrade: currentGrade
//             })
//             setTrainings(response.data);
//             setFetchingTraining(false);
//             // console.log(response);
//         }).catch(err => {
//             setFetchingTraining(false);
//             console.log(err);
//         })
//     }

//     useEffect(() => {
//         modal &&
//             fetchTrainingById();
//     }, [id, modal])

//     return { trainings, defaultValues, fetchingTraining, setDefaultValues }
// }

// export default useTrainingById



// All the trainings from django server

export const useTrainings = () => {
    const queryClient = useQueryClient();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const [filter, setFilter] = useState({
        trainings__school: null, trainer: null
    })

    const fetchTraining = async (filter, pagination) => {
        try {
            const response = await api({
                method: 'GET',
                url: "/training/",
                params: {
                    ...filter,
                    offset: (pagination.current - 1) * pagination.pageSize,
                    limit: pagination.pageSize
                },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            setPagination(prev => ({
                ...prev,
                total: response.data?.count
            })
            )
            return response.data?.results

        } catch (error) {
            return error.message ? error.message : "Could not fetch the Trainings"
        }
    }


    const addTraining = async (values) => {
        try {
            const response = await api({
                method: 'POST',
                url: "/training/",
                data: values,
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })

            if (response.status !== 201) {
                throw new Error(response.message ? response.message : "Failed to add Training")
            }
            return response
        } catch (error) {
            throw new Error(error.message ? error.message : "Failed to add Training")
        }
    }

    const updateTraining = async (value, id) => {
        console.log(value, id)
        try {
            const response = await api({
                method: 'PUT',
                url: `/training/${id}/`,
                data: { ...value },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            if (response.status !== 202) {
                throw new Error(response.message ? response.message : "Failed to update Training")
            }
        } catch (error) {
            throw new Error(error.message ? error.message : "Failed to update Training")
        }
    }

    const deleteTraining = async (id) => {
        try {

            const response = await api({
                method: 'DELETE',
                url: `/training/${id}/`,
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            if (response.status !== 204) {
                throw new Error(response.message ? response.message : "Failed to delete Training")
            }
        } catch (error) {
            throw new Error(error.message ? error.message : "Failed to delete Training")
        }
    }


    // Fetch all trainings with Pagination
    const { data: trainingsData, isLoading: loadingTraining, refetch: refetchTrainings } = useQuery({
        queryKey: ['trainings', pagination],
        queryFn: () => fetchTraining(filter, pagination),
        onError: (error) => {
            message.error(error.message ? error.message : "Failed to fetch Trainings")
        }
    })


    // Add a new training
    const { mutate: addTrainingMutate } = useMutation({
        mutationFn: (values) => addTraining(values),
        onSuccess: () => {
            message.success("Training Added Successfully");
            queryClient.invalidateQueries({ queryKey: ['trainings'] })
            queryClient.invalidateQueries({ queryKey: ['requestedTraining'] })
        },
        onError: (error) => {
            message.error(error.message ? error.message : "Failed to add Training")
        }
    }
    )

    // update Trainings
    const { mutate: updateTrainingMutate } = useMutation({
        mutationFn: ({ value, id }) => updateTraining(value, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainings'] })
            message.success("Training Updated Successfully");
        },
        onError: (error) => {
            message.error(error.message ? error.message : "Failed to update Training")
        }
    })

    // Delete Trainings
    const { mutate: deleteTrainingMutate } = useMutation({
        mutationFn: (id) => deleteTraining(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainings'] })
            queryClient.invalidateQueries({ queryKey: ['requestedTraining'] })
            message.success("Training Deleted Successfully");
        },
        onError: (error) => {
            message.error(error.message ? error.message : "Failed to delete Training")
        }
    })

    return { setPagination, setFilter, filter, pagination, loadingTraining, trainingsData, addTrainingMutate, updateTrainingMutate, deleteTrainingMutate, refetchTrainings }
}

export const useAllTrainings = () => {
    const fetchTrainings = async () => {
        try {
            const response = await api({
                method: 'GET',
                url: "/training/all",
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            if (response.status !== 200) {
                throw new Error(response.message ? response.message : "Failed to fetch Trainings")
            }
            return response.data;
        } catch {
            throw new Error(error.message ? error.message : "Failed to fetch Trainings")
        }
    }

    const { data: trainingsData, isLoading: loading } = useQuery({
        queryKey: ['all_trainings'],
        queryFn: () => fetchTrainings(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    })

    return { trainingsData, loading }
}

