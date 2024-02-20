import { useEffect, useState } from "react"
import api from "../interceptor/axios_interceptor";
import { useToken } from "./token_hooks";

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
            console.log(response.data);
            setGradeLoading(false);
            const grades = response?.data?.map(grade => ({
                value: grade?.id,
                label: grade?.grades
            }))
            setGrades(grades);
        }).catch(err => {
            setGradeLoading(false);
            console.log(err);
        })
    }

    useEffect(() =>{
        fetchGrades();
    }, [])

    return {grades, gradeLoading}
}


export default useGrades;