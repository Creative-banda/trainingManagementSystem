import api from "../utilities/axios_interceptor";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "./token_hooks";

export default function useGrades() {

    const fetchGrades = async () => {
        try {
            const response = await api({
                method: 'GET',
                url: '/school/grades/',
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            throw new Error("Failed to Fetch the Grades")
        }
    }

    const {data:grades, isLoading:loading} = useQuery({
        queryKey: ['grade'],
        queryFn: fetchGrades
    })

    return {
        loading,
        grades,
    }
}