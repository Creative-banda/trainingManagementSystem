import { message } from "antd";
import { useToken } from "./token_hooks";
import api from "../utilities/axios_interceptor";
import {useState } from "react";

export const useSheet = ({ id, subject }) => {
    const [loading, setLoading] = useState(false);
    const [sheetData, setSheetData] = useState([]);
    const { access_token } = useToken();
    // console.log(sheetData);

    const fetchSchoolSheet = async () => {
        console.log("Fetching School Sheet")
        setLoading(true);
        await api({
            method: 'GET',
            url: `/training/sheet/${id}/`,
            params: { subject: subject },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 200) {
                setSheetData(response.data?.trainingData);
                setLoading(false);
            } else {
                setLoading(false);
                console.log(response);
                message.error("Something went wrong");
            }
        }).catch(error => {
            setLoading(false);
            console.log(error);
            message.error("Something went wrong");
        })
    }

    const postSchoolSheet = async (data, subject) => {
        setLoading(true);
        await api({
            method: 'POST',
            url: `/training/sheet/${id}/`,
            data: data,
            params: { subject: subject },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 200) {
                message.success("Data Update");
                setLoading(false);
            } else {
                // console.log(response);
                message.error("Data not updated");
                setLoading(false);
            }
        }).catch(error => {
            setLoading(false);
            console.log(error);
            message.error("Something went wrong");
        })
    }

    const patchSheetData = async ({ data, id }) => {
        console.log(data, id)
        setLoading(true);
        await api({
            method: 'PUT',
            url: `/training/sheet/data/${id}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 200) {
                console.log(response.data)
                message.success("Data Updated");
                setLoading(false);
            } else {
                console.log(response);
                message.error("Data not updated");
                setLoading(false);
            }
        }).catch(error => {
            setLoading(false);
            console.log(error);
            message.error("Something went wrong");
        })
    }

    const deleteSheetData = async (id) => {
        setLoading(true);
        await api({
            method: 'DELETE',
            url: `/training/sheet/data/${id}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 204) {
                console.log(response.data)
                message.success("Data Deleted");
                setLoading(false);
            } else {
                console.log(response);
                message.error("Data not deleted");
                setLoading(false);
            }
        }).catch(error => {
            setLoading(false);
            console.log(error);
            message.error("Something went wrong");
        })
    }

    return { sheetData, loading, fetchSchoolSheet, postSchoolSheet, patchSheetData, deleteSheetData }

}