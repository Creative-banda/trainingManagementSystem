import { useState } from "react"
import api from "../interceptor/axios_interceptor";
import { useToken } from "./token_hooks";
import { message } from "antd";

const useRequestTraining = () => {
    const [requestedTraining, setRequestedTraining] = useState([]);
    const [loading, setLoading] = useState(false);
    const {access_token} = useToken();
    const fetchRequestedTraining = async (params) => {
        setLoading(true);
        await api({
            method: 'GET',
            url: 'training/request/',
            params: { ...params },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if(response.status === 200){
                setRequestedTraining(response.data);
            }else{
                message.error(response.data.message);
            }
            setLoading(false);
        }).catch(err => {
            message.error(err?.response?.data ? err?.response?.data : "Something went wrong");
            setLoading(false);
        })
    }

    const updateRequestedTraining = async (data) => {
        await api({
            method: 'PUT',
            url: `training/request/${data?.id}/`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then(response => {
            if(response.status === 202){
                message.success("Training Request Updated Successfully");
            }else{
                message.error(response.data.message);
            }
        }).catch(err => {
            message.error(err?.response?.data ? err?.response?.data : "Something went wrong");
        })
    }

    return { requestedTraining, fetchRequestedTraining, loading, updateRequestedTraining }
}

export default useRequestTraining