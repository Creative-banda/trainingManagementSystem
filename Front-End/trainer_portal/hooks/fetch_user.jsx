import { useEffect, useState } from "react";
import api from "../utilities/axios_interceptor";

const useUserOptions = () => {

    const [userName, setUserName] = useState([])
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        await api({
            method: 'GET',
            url: "/account/users/"
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


