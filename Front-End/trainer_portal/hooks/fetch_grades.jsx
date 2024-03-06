import { useEffect, useState } from "react"
import { useToken } from "./token_hooks";
import api from "../utilities/axios_interceptor";
import { message } from "antd";

const useGrades = () => {
    const [grades, setGrades] = useState([{value:"", label:""}]);
    const [gradeLoading, setGradeLoading] = useState(false);
    const { access_token } = useToken();

    const fetchGrades = async () => {
        setGradeLoading(true);
        await api({
            method: "GET",
            url: `/school/grades/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            // console.log(response.data);
            setGradeLoading(false);
            const grades = response?.data?.map(grade => ({
                value: grade?.id,
                label: grade?.grades
            }))
            setGrades(grades);
        }).catch(err => {
            setGradeLoading(false);
            message.error("Error while fetching grades");
        })
    }

    useEffect(() =>{
        fetchGrades();
    }, [])

    return {grades, gradeLoading}
}


export default useGrades;