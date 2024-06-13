import { useEffect, useState } from "react";
import api from "../interceptor/axios_interceptor"
import { useToken } from "./token_hooks";
import { useQuery } from "@tanstack/react-query";

const useUserOptions = () => {

    const fetchUsers = async () => {
        try {
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
                desc: user?.user?.total_training,
                role: user?.users?.role
            }));
            return data;
        } catch (err) {
            console.log(err);
            throw new Error(err.message ? err.message : "Can not fetch the users");
        }
    }

    const { data: userName, isLoading: loading } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    })

    return { userName, loading }
};

export default useUserOptions;


