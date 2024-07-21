import { useState } from "react"
import api from "../interceptor/axios_interceptor";
import { useToken } from "./token_hooks";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";

const useRequestTraining = () => {
    const [filters, setFilters] = useState({
        school: "", subject: "", requestor: "", status: "PENDING", active:true
    })

    const { access_token } = useToken()

    const updateRequestedTraining = async (data) => {
        await api({
            method: 'PUT',
            url: `training/request/${data?.id}/`,
            data: data,
            headers: {
                "Authorization": "Bearer " + access_token
            }
        }).then(response => {
            if (response.status === 202) {
                message.success("Training Request Updated Successfully");
            } else {
                message.error(response.data.message);
            }
        }).catch(err => {
            message.error(err?.response?.data ? err?.response?.data : "Something went wrong");
        })
    }

    const fetchRequestedTraining = async (filters) => {
        try{
            const response = await api({
                method: 'GET',
                url: 'training/request/',
                params: { ...filters },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
            return response.data;
        } catch(err){
            throw new Error(err.message ? err.message : "Failed to fethch requested training");
        }
    }

    const {data: requestedTraining, loading, refetch: refetchRquestedTraining} = useQuery({
        queryKey: ['requestedTraining'],
        queryFn: () => fetchRequestedTraining({ ...filters }),
    })
    

    return { requestedTraining, fetchRequestedTraining, refetchRquestedTraining, loading, updateRequestedTraining, filters, setFilters }
}

export default useRequestTraining