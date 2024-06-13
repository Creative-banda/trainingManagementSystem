import api from "../utilities/axios_interceptor";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "./token_hooks";

const useGrades = () => {

    const fetchGrades = async () => {
        const response = await api({
            method: "GET",
            url: `/school/grades/`,
            headers: {
                "Authorization": `Bearer ${useToken().access_token}`
            }
        })
        const grades = response?.data?.map(grade => ({
            value: grade?.id,
            label: grade?.grades
        }))
        if (response.status !== 200) {
            throw new Error("Can not fetch grades")
        }
        return grades
    }

    const {data: grades, isLoading: gradeLoading} = useQuery({
        queryKey: ["grades"],
        queryFn: fetchGrades,
        onError: (err) => {
            message.error(err.message ? err.message : "Can not fetch grades")
        }
    })

    return { grades, gradeLoading }
}






export default useGrades;