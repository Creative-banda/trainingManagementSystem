import { useEffect, useState } from "react";
import api from "../interceptor/axios_interceptor"
import { useToken } from "./token_hooks";

const useUserOptions = () => {

    const [userName, setUserName] = useState([])
    const [loading, setLoading] = useState(false);
    const { access_token } = useToken();

    const fetchUsers = async () => {

        setLoading(true);
        await api({
            method: 'GET',
            url: "/account/users/",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        }).then(response => {
            setLoading(false);
            const data = response.data?.map(user => ({
                label: user?.user?.username,
                value: user?.user?.id,
                desc: user?.user?.total_training
            }));
            setUserName(data);

        }).catch(error => {
            setLoading(false);
            console.log(error);
        })
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    return { userName, loading }
};

export default useUserOptions;


