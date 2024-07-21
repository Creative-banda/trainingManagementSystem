import { useContext, useEffect, useState } from "react"
import { message } from "antd";
import { useToken } from "./token_hooks";
import api from "../interceptor/axios_interceptor";
import { ModalContext } from "../context/modal_context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const useSchools = () => {
    const queryClient = useQueryClient();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const { access_token } = useToken();

    const fetchSchools = async (params = {}) => {
        try {
            const response = await api({
                method: "GET",
                url: "/school/",
                params: { ...params },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            setPagination({
                ...pagination,
                total: response.data.count
            })
            return response.data.results
        } catch (error) {
            throw new Error(error.message ? error.message : "Something went wrong while fetching school");
        }
    }

    const registerSchool = async (data) => {
        try {
            const response = await api({
                method: "POST",
                data: data,
                url: "/school/",
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            })
            console.log(response)
            return response.data
        } catch (err) {
            throw new Error(err.message ? err.message : "Not able to registor school");
        }
    }

    const fetchAllSchools = async () => {
        try {
            const response = await api({
                method: "GET",
                url: "/school/",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            const schoolOptions = response.data?.map(school => ({
                value: school?.id,
                label: school?.name
            }))
            return schoolOptions
        } catch (error) {
            throw new Error(error.message ? error.message : "Something went wrong while fetching school");
        }
    }

    const deleteSchool = async (id) => {
        setLoading(true);
        await api({
            method: "DELETE",
            url: `/school/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 204) {
                message.success("Successfully deleted");
                setDeleteSchoolModal(false);
            } else {
                message.error("Something went wrong");
            }
            setLoading(false)
        }).catch(error => {
            setLoading(false);
            message.error("Something went wrong");
        })
    }

    const { data: schools, isLoading: fetchingSchool } = useQuery({
        queryKey: ["schools", { limit: pagination.pageSize, offset: (pagination.current - 1) * pagination.pageSize }],
        queryFn: () => fetchSchools({ limit: pagination.pageSize, offset: (pagination.current - 1) * pagination.pageSize }),
        retry: false,
        refetchOnWindowFocus: false,
    })

    const { data: allSchoolOptions, isLoading: fetchingAllSchools } = useQuery({
        queryKey: ["allSchools"],
        queryFn: () => fetchAllSchools(),
        retry: false,
        refetchOnWindowFocus: false,
    })

    const { mutate: registerSchoolMutate, isLoading: submitting } = useMutation({
        mutationFn: (data) => registerSchool(data),
        onSuccess: () => {
            message.success("Successfully Registered")
            queryClient.invalidateQueries({ queryKey: ["schools"] })
        },
        onError: (error) => {
            message.error(error.message)
        }

    })

    return { schools, fetchingSchool, fetchingAllSchools, allSchoolOptions, setPagination, pagination, deleteSchool, registerSchoolMutate, submitting }
}

export default useSchools;


export const useSchoolById = (id) => {
    const { setEditSchoolModal } = useContext(ModalContext);
    const { access_token } = useToken();

    const queryClient = useQueryClient();

    const fetchSchoolById = async () => {
        try {
            const response = await api({
                method: 'GET',
                url: `/school/${id}/`,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
            return response.data
        } catch (err) {
            throw new Error("Failed to Fetch the Data")
        }
    }



    const updateSchool = async (data) => {
        try {
            const response = await api({
                method: "PUT",
                data: data,
                url: `/school/${id}/`,
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            })
            console.log(response)
            return response.data
        } catch (err) {
            throw new Error("Faied to update the school")
        }
    }

    const deleteSchool = async (id) => {
        try {
            const response = await api({
                method: "DELETE",
                url: `/school/${id}`,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
            return response.data
        } catch (err) {
            throw new Error("Failed to delete the school")
        }
    }

    const { data: school } = useQuery({
        queryKey: ["school", id],
        queryFn: fetchSchoolById,
        retry: false,
        refetchOnWindowFocus: false
    })

    const { mutate: updateSchoolMutate, isLoading: updating } = useMutation({
        mutationFn: (data) => updateSchool(data),
        onSuccess: () => {
            message.success("Successfully Updated")
            queryClient.invalidateQueries({ queryKey: ["school", id] })
            setEditSchoolModal(false)
        },
        onError: (error) => {
            message.error(error.message)
        }
    })

    const { mutate: deleteSchoolMutate, isLoading: loading } = useMutation({
        mutationFn: (id) => deleteSchool(id),
        onSuccess: () => {
            message.success("Successfully Deleted")
            queryClient.invalidateQueries({ queryKey: ["school", id] })
        },
        onError: (error) => {
            message.error(error.message)
        }
    })


    return { school, loading, updateSchoolMutate, updating, deleteSchoolMutate, }
}