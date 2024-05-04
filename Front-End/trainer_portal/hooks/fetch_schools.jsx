import { useEffect, useState } from "react"
import { message } from "antd";
import { useToken } from "./token_hooks";
import api from "../utilities/axios_interceptor";

const useSchools = () => {
    const [schoolOptions, setSchoolOptions] = useState([])
    const [schools, setSchools] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [fetchingSchool, setFetchingSchool] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 1000,
    });
    const { access_token } = useToken();


    const fetchSchools = async (params = {}) => {
        setFetchingSchool(true);
        await api({
            method: "GET",
            url: "/school/",
            params: { ...params },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        })
            .then((response) => {
                const { results, count } = response.data;

                const schools = results?.map(school => ({
                    value: school?.id,
                    label: school?.name
                }))

                setSchoolOptions(schools);
                setSchools(results);
                setFetchingSchool(false);

            })
            .catch((error) => {
                console.log(error);
                setFetchingSchool(false)
            })
    }

    const registerSchool = async (data) => {
        console.log(data);
        await api({
            method: "POST",
            data: data,
            url: "/school/",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then(res => {
            if(res.status === 201){
                message.success("Successfully registered");
            } else {
                console.log(res);
                const error = Object.keys(res.response.data)[0]
                message.error(res.response.data[error]);
            }
        }).catch(err => {
            message.error("Couldn't register");
        })


    }


    const filterSchool = async (filter) => {
        // console.log(filter)
        setFetchingSchool(true);
        await api({
            method: "GET",
            url: `/school/filter/`,
            params: { ...filter },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then(response => {
            if (response.status === 200) {
                setFilteredData(response.data);
            }
            else {
                message.error(response.data.message ? response.data.message : "Error while fetching School !");
            }
            setFetchingSchool(false);
        }).catch(error => {
            setFetchingSchool(false);
            console.log(error);
            message.error(error.response.data.message ? error.response.data.message : "Error while fetching School !")
        })
    }

    useEffect(() => {
        fetchSchools({
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        });
    }, [pagination.current, pagination.pageSize])

    return { schools, fetchingSchool, schoolOptions, fetchSchools, setPagination, pagination, filterSchool, filteredData, registerSchool }
}

export default useSchools;


export const useSchoolById = () => {
    const [school, setSchool] = useState({});
    const [updating, setupdating] = useState(false);
    const [defaultGrade, setDefaultGrades] = useState([]);
    const [loading, setLoading] = useState(false);

    const { access_token } = useToken();

    const fetchSchoolById = async (id) => {
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

    return { school, defaultGrade, loading, setSchool, updateSchool, updating, fetchSchoolById }
}