import { useEffect, useState } from "react";
import api from "../utilities/axios_interceptor";
import { useToken } from "./token_hooks";
import { useQuery } from "@tanstack/react-query";

const useUserOptions = () => {
    const fetchUsers = async () => {
        const response = await api({
            method: 'GET',
            url: "/account/users/",
            headers: {
                "Authorization": `Bearer ${useToken().access_token}`
            }
        })
        const data = response.data?.map(user => ({
            label: user?.user?.username,
            value: user?.user?.id,
            desc: user?.user?.total_training
        }));
        return data
    }

    const {data: userName, isLoading: loading} = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
        retry: false,
        refetchOnWindowFocus: false,
    })

    return { userName, loading }
};

export default useUserOptions;


