import { useContext, useEffect, useState } from "react"
import { message } from "antd";
import { useToken } from "./token_hooks";
import api from "../interceptor/axios_interceptor";
import { ModalContext } from "../context/modal_context";

const useSchools = (id) => {
    const [schoolOptions, setSchoolOptions] = useState([])
    const [schools, setSchools] = useState([]);
    const [fetchingSchool, setFetchingSchool] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const { access_token } = useToken();




    const fetchSchools = async (params = {}) => {
        setFetchingSchool(true);
        await api({
            method: "GET",
            url: `${id ? `/school/${id}/` : "/school/"}`,
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
                setPagination({
                    ...pagination,
                    total: count
                })
                setFetchingSchool(false);

            })
            .catch((error) => {
                console.log(error);
                setFetchingSchool(false)
            })
    }

    useEffect(() => {
        fetchSchools({
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        });
    }, [id, pagination.current, pagination.pageSize])

    return { schools, fetchingSchool, schoolOptions, fetchSchools, setPagination, pagination }
}

export default useSchools;


export const useSchoolById = (id) => {
    const [school, setSchool] = useState({});
    const [updating, setupdating] = useState(false);
    const [defaultGrade, setDefaultGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const { editSchoolModel, setEditSchoolModal } = useContext(ModalContext);

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

                setDefaultGrades(grades);
                setSchool(response.data);
            } else{
                message.error("Something went wrong !");
            }
            setLoading(false);

        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    const updateSchool = async (data) => {
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
            if(response.status === 200){
                message.success("Successfully updated");
                setupdating(false);
                setEditSchoolModal(false);
            }else{
                message.error("Something went wrong");
                setupdating(false);
            }
        }).catch(err => {
            const lable = Object.keys(err.response.data)[0]
            message.error(err?.response?.data[lable])
            setupdating(false);
        })
    }


    useEffect(() => {
        if(id){
            editSchoolModel && fetchSchoolById();
        }
    }, [id, editSchoolModel])

    return { school, defaultGrade, loading, setSchool, updateSchool, updating }
}