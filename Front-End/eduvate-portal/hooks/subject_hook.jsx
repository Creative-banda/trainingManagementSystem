import api from "../interceptor/axios_interceptor"
import { useQuery } from "@tanstack/react-query"
import { useToken } from "./token_hooks"


const useSubjects = () => {

    const fetchSubjects = async () => {
        try {
            const response = await api({
                method: 'GET',
                url: '/teacher/subjects/',
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            // console.log(response)
            const subjects = response.data.map(subject => {
                return { label: subject.name, value: subject.id }
            })
            return subjects
        } catch (error) {
            console.log(error)
            throw new Error("Failed to fetch the Subjects")
        }
    }

    const { data: subjects, isLoading: loading } = useQuery({
        queryKey: ["subjects"],
        queryFn: fetchSubjects,
        retry: false,
        refetchOnWindowFocus: false
    })

    return { subjects, loading }
}

export default useSubjects
