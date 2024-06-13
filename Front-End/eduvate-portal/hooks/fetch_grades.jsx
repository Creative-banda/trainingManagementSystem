import { message } from "antd";
import api from "../interceptor/axios_interceptor";
import { useToken } from "./token_hooks";
import { useQuery } from "@tanstack/react-query";

const useGrades = () => {
    // const [grades, setGrades] = useState([{ value: "", label: "" }]);
    // const [gradeLoading, setGradeLoading] = useState(false);
    const { access_token } = useToken();

    // const fetchGrades = async () => {
    //     setGradeLoading(true);
    //     try {
    //         const response = await api({
    //             method: "GET",
    //             url: `/school/grades/`,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + access_token
    //             }
    //         })
    //         setGradeLoading(false);
    //         const grades = response?.data?.map(grade => ({
    //             value: grade?.id,
    //             label: grade?.grades
    //         }))
    //         setGrades(grades);
    //     } catch (err) {
    //         setGradeLoading(false);
    //         console.log(err);
    //     }
    // }
    const fetchGrades = async () => {
        try {
            const response = await api({
                method: "GET",
                url: `/school/grades/`,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
            const grades = response?.data?.map(grade => ({
                value: grade?.id,
                label: grade?.grades
            }))
            // console.log(grades);
            return grades
        } catch (err) {
            console.log(err);
            throw new Error(err.response.data.message ? err.response.data.message : "Can not fetch the grades");
        }
    }

    const { data: grades, isLoading: gradeLoading, error } = useQuery({
        queryKey: ["grades"],
        queryFn: fetchGrades,
        refetchOnWindowFocus: false,
        onError: (error) => {
            message.error(error.message ? error.message : "Can not fetch the grades");
        },
    })

    return { grades, gradeLoading, error }
}


export default useGrades;