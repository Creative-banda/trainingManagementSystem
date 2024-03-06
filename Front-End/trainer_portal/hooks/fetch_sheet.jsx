import { message } from "antd";
import { useToken } from "./token_hooks";
import api from "../utilities/axios_interceptor";
import {useEffect, useState } from "react";

export const useSheet = ({ id = 0 }) => {
    const [loading, setLoading] = useState(false);
    const [sheetData, setSheetData] = useState([]);
    const { access_token } = useToken();
    // console.log(id);

    const fetchSchoolSheet = async () => {
        setLoading(true);
        await api({
            method: 'GET',
            url: `/training/sheet/${id}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 200) {
                console.log(response.data);
                setSheetData(response.data.trainingData);
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

    const postSchoolSheet = async (data) => {
        setLoading(true);
        await api({
            method: 'POST',
            url: `/training/sheet/${id}/`,
            data: data,
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

    useEffect(() => {
        id && id !== 0 && fetchSchoolSheet();
    }, [id]);

    return { sheetData, loading, fetchSchoolSheet, postSchoolSheet, patchSheetData, deleteSheetData }

}