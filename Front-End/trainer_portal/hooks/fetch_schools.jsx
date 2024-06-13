import { useMemo, useState } from "react"
import { message } from "antd";
import { useToken, useUserInfo } from "./token_hooks";
import api from "../utilities/axios_interceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useSchools = () => {
    const { userInfo } = useUserInfo();

    const [filters, setFilters] = useState({
        id: "",
        catagory: "",
        am: userInfo?.id,
        om: "",
    })
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 1000,
    });

    const queryClient = useQueryClient();


    const fetchSchools = async (params = {}) => {
        try {

            const response = await api({
                method: "GET",
                url: "/school/",
                params: { ...params },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            if (response.status !== 200) {
                throw new Error("Can not fetch schools")
            }
            return response.data.results
        } catch (error) {
            message.error(error.message ? error.message : "Can not fetch schools")
            throw new Error(error.message ? error.message : "Can not fetch schools")
        }
    }

    const registerSchool = async (data) => {
        try {
            const response = await api({
                method: "POST",
                data: data,
                url: "/school/",
            })
            message.success("Successfully registered");
            return response.data;
        } catch (error) {
            throw new Error(error.message ? error.message : "Can not register school")
        }
    }

    const filterSchool = async () => {
        try {
            const response = await api({
                method: "GET",
                url: `/school/filter/`,
                params: { ...filters },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            message.error(error.message ? error.message : "Can not fetch schools")
            throw new Error(error.message ? error.message : "Can not fetch schools")
        }
    }


    // Fetch the schools based on pagination
    const { data: schools, isLoading: fetchingSchool } = useQuery({
        queryKey: ["schools", pagination],
        queryFn: () => fetchSchools({ limit: pagination.pageSize, offset: (pagination.current - 1) * pagination.pageSize }),
    })

    // Set the school options when the schools are fetched
    const schoolOptions = useMemo(() => {
        const school = schools?.map(school => {
            return { label: school.name, value: school.id }
        })
        return school
    }, [schools])

    // Register a new school
    const { mutate: registerSchoolMutate } = useMutation({
        mutationFn: (data) => registerSchool(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schools"] })
        }
    })

    // Filter schools based on the search query
    const { data: filteredData } = useQuery({
        queryKey: ["filteredSchools", filters],
        queryFn: () => filterSchool({ ...filters }),
    })

    return { schools, fetchingSchool, schoolOptions, setPagination, pagination, filteredData, setFilters, filters, registerSchoolMutate }
}

export default useSchools;


export const useSchoolById = () => {
    const [defaultGrade, setDefaultGrades] = useState([]);

    const queryClient = useQueryClient();

    const fetchSchoolById = async (id) => {
        try {
            const response = await api({
                method: 'GET',
                url: `/school/${id}/`,
            })
            const grades = response?.data?.grades?.map(grade => ({
                label: grade?.grades,
                value: grade?.id
            }))

            setDefaultGrades(grades);
            return response.data
        } catch (error) {
            throw new Error(error.message ? error.message : "Can not fetch school")
        }
    }

    const updateSchool = async (id, data) => {
        try {
            const response = await api({
                method: "PUT",
                data: data,
                url: `/school/${id}/`,
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            throw new Error(error.message ? error.message : "Can not update school")
        }
    }

    const { data: school, isLoading: loading } = useQuery({
        queryKey: ["school_by_id"],
        queryFn: () => fetchSchoolById(),
        retry: 0,
        refetchOnWindowFocus: false
    })

    const { mutate: updateSchoolMutate, isLoading: updating } = useMutation({
        mutationFn: ({ id, data }) => updateSchool(id, data),
        onSuccess: () => {
            message.success("School updated successfully")
            queryClient.invalidateQueries({ queryKey: ["filteredSchools"] })
        }, 
        onError: () => {    
            message.error("Failed to update the school")
        }
    })

    return { school, defaultGrade, loading, updateSchoolMutate, updating, fetchSchoolById }
}