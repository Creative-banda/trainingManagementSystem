import { useContext, useEffect, useState } from "react"
import api from "../interceptor/axios_interceptor";
import { useToken } from "./token_hooks";
import { ModalContext } from "../context/modal_context";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useSchool = () => {
    const [submitting, setSubmittion] = useState(false);
    const { access_token } = useToken();
    const queryCient = useQueryClient()
    
    // const registerSchool = async (data) => {
    //     setSubmittion(true);
    //     await api({
    //         method: "POST",
    //         data: data,
    //         url: "/school/",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": "Bearer " + access_token
    //         }
    //     }).then(res => {
    //         console.log(res);
    //         if (res.data) {
    //             message.success("Successfully registered");
    //             setSubmittion(false);
    //             setSchoolModal(false);
    //         } else {
    //             const lable = Object.keys(err.response.data)[0]
    //             message.error(err.response.data[lable][0]);
    //             setSubmittion(false);
    //         }
    //     }).catch(err => {
    //         const lable = Object.keys(err.response.data)[0]
    //         message.error(err.response.data[lable][0]);
    //         setSubmittion(false);
    //     })


    // }

    const registerSchool = async (data) => {
        try {
            const response = await api({
                method: "POST",
                data: data,
                url: "/school/",
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            })
            return response.data
        } catch (err) {
            throw new Error(err.message ? err.message : "Not able to registor school");
        }
    }

    const {} = useMutation({
        mutationFn: registerSchool,
        onSuccess: () => {
            queryCient.invalidateQueries({ queryKey: ["schools"] })
        }
    })


    return { submitting, registerSchool }
}

export default useSchool;

// export const useSchoolById = (id) => {
//     const { access_token } = useToken();
//     const [schoolData, setSchool] = useState({});
//     const [defaultGrades, setDefaultGrades] = useState({
//         defaultTrainers: [],
//         defaultGrades: [],
//     });

//     const fetchSchoolById = async () => {
//         await api({
//             method: 'GET',
//             url: `/school/${id}/`,
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + access_token
//             }
//         }).then(response => {
//             const grades = response?.data?.grades?.map(grade => ({
//                 label: grade?.grades,
//                 value: grade?.id
//             }))
//             setSchool(response.data);
//         }).catch(err => {
//             console.log(err);
//         })
//         return {}
//     }



//     useEffect(() => {
//         id &&
//             fetchSchoolById();
//     }, [id])
// }

