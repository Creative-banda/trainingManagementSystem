import { useContext, useEffect, useState } from "react"
import { message } from "antd";
import { useToken } from "./token_hooks";
import api from "../interceptor/axios_interceptor";
import { ModalContext } from "../context/modal_context";
import { useQuery } from "@tanstack/react-query";

const useSchools = () => {
    // const [schools, setSchools] = useState([]);
    // const [fetchingSchool, setFetchingSchool] = useState(false);
    const [fetchingAllSchools, setFetchingAllSchools] = useState(false);
    const [allSchoolOptions, setAllSchoolOptions] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const { access_token } = useToken();

    // const fetchSchools = async (params = {}) => {
    //     setFetchingSchool(true);
    //     await api({
    //         method: "GET",
    //         url: "/school/",
    //         params: { ...params },
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": "Bearer " + access_token
    //         }
    //     })
    //         .then((response) => {
    //             const { results, count } = response.data;
    //             setSchools(results);
    //             setPagination({
    //                 ...pagination,
    //                 total: count
    //             })
    //             setFetchingSchool(false);

    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             setFetchingSchool(false)
    //         })
    // }

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

    const fetchAllSchools = async () => {
        setFetchingAllSchools(true);
        await api({
            method: "GET",
            url: "/school/",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    // console.log(response.data);
                    const schoolOptions = response.data?.map(school => ({
                        value: school?.id,
                        label: school?.name
                    }))
                    setAllSchoolOptions(schoolOptions);
                } else {
                    message.error("Error while fetching all schools");
                    console.log(response.data)
                }
                setFetchingAllSchools(false);
            })
            .catch((error) => {
                console.log(error);
                setFetchingAllSchools(false)
            })
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
        refetchOnWindowFocus: false
    })


    // useEffect(() => {
    //     fetchSchools({
    //         limit: pagination.pageSize,
    //         offset: (pagination.current - 1) * pagination.pageSize
    //     });
    // }, [pagination.current, pagination.pageSize])

    useEffect(() => {
        fetchAllSchools();
    }, [])

    return { schools, fetchingSchool, fetchingAllSchools, allSchoolOptions, fetchSchools, setPagination, pagination, deleteSchool }
}

export default useSchools;


export const useSchoolById = (id) => {
    const [school, setSchool] = useState({});
    const [schoolOptions, setSchoolOptions] = useState([])
    const [updating, setupdating] = useState(false);
    const [defaultGrade, setDefaultGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setEditSchoolModal } = useContext(ModalContext);
    const { access_token } = useToken();

    const fetchSchoolById = async () => {
        setLoading(true);
        await api({
            method: 'GET',
            url: `/school/${id}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 200) {
                const grades = response?.data?.grades?.map(grade => ({
                    label: grade?.grades,
                    value: grade?.id
                }))

                const schools = results?.map(school => ({
                    value: school?.id,
                    label: school?.name
                }))

                setSchoolOptions(schools);

                setDefaultGrades(grades);
                setSchool(response.data);
            } else {
                message.error("Something went wrong !");
            }
            setLoading(false);

        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    const updateSchool = async (id, data) => {
        setupdating(true);
        await api({
            method: "PUT",
            data: data,
            url: `/school/${id}/`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                message.success("Successfully updated");
                setupdating(false);
                setEditSchoolModal(false);
            } else {
                message.error("Something went wrong");
                setupdating(false);
            }
        }).catch(err => {
            const lable = Object.keys(err.response.data)[0]
            message.error(err?.response?.data[lable])
            setupdating(false);
        })
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
            // console.log(response);
            if (response.status === 204) {
                message.success("Successfully deleted");
            } else {
                message.error("Something went wrong");
            }
            setLoading(false)
        }).catch(error => {
            console.log(error);
            setLoading(false);
            message.error("Something went wrong");
        })
    }

    return { school, defaultGrade, loading, setSchool, updateSchool, updating, schoolOptions, deleteSchool, fetchSchoolById }
}