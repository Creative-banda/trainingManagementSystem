import { message } from "antd";
import { useToken } from "./token_hooks";
import api from "../utilities/axios_interceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSheet = ({ id, subject }) => {
    // id: SchoolId and subject: subject that sheet you want to access

    const queryClient = useQueryClient();
    const { access_token } = useToken();
    // console.log(sheetData);

    const fetchSchoolSheet = async () => {
        try {
            const response = await api({
                method: 'GET',
                url: `/training/sheet/${id}/`,
                params: { subject: subject },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response?.data?.trainingData
        } catch (error) {
            throw new Error("Failed to fetch the Sheet")
        }
    }

    const postSchoolSheet = async (data, subject) => {
        try {
            const response = await api({
                method: 'POST',
                url: `/training/sheet/${id}/`,
                data: data,
                params: { subject: subject },
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response
        } catch (error) {
            throw new Error("Failed to save the data")
        }
    }

    const patchSheetData = async ({ data, id }) => {
        try {
            const response = await api({
                method: 'PUT',
                url: `/training/sheet/data/${id}/`,
                data: data,
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            return response.data
        } catch (error) {
            throw new Error("Failed to update the data")
        }
    }

    const deleteSheetData = async (id) => {
        try {
            const response = await api({
                method: 'DELETE',
                url: `/training/sheet/data/${id}/`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            })
            return response.data
        } catch (err) {
            throw new Error("Failed to delete the data")
        }
    }

    const { data: sheetData, isLoading: loading, refetch: refetchSchoolSheet } = useQuery({
        queryKey: ["schoolSheet", { id, subject }],
        queryFn: fetchSchoolSheet,
        refetchOnWindowFocus: false,
        retry: false,
    })

    const { mutate: postSchoolSheetMutate } = useMutation({
        mutationFn: (data) => postSchoolSheet(data, subject),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schoolSheet"] })
        },
        onError: () => {
            message.error("Failed to save the data")
        }
    })

    const { mutate: patchSheetDataMutate } = useMutation({
        mutationFn: ({ data, id }) => patchSheetData({ data, id }),
        onSuccess: () => {
            message.success("Data Updated");
            queryClient.invalidateQueries({ queryKey: ["schoolSheet"] })
        },
        onError: (error) => {
            message.error("Failed to update the data")
        }
    })

    const { mutate: deleteSheetDataMutate } = useMutation({
        mutationFn: (id) => deleteSheetData(id),
        onSuccess: () => {
            message.success("Data deleted");
            queryClient.invalidateQueries({ queryKey: ["schoolSheet"] })
        },
        onError: () => {
            message.error("Failed to delete the Data")
        }
    })


    return { sheetData, loading, refetchSchoolSheet, postSchoolSheetMutate, patchSheetDataMutate, deleteSheetDataMutate }

}