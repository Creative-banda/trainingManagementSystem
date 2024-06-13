import api from "../interceptor/axios_interceptor";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "./token_hooks";

export const useTrainingStatistics = () => {
    const fetch_statistics = async () => {
        try {
            const response = await api({
                method: "GET",
                url: "/training/statistics/?year=2024&start_month=1&end_month=12",
                headers: {
                    "Authorization": `Bearer ${useToken().access_token}`
                }
            })
            // const uniqueLabels = Array.from(new Set(response?.data?.map(item => item.month)));
            const uniqueLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const formattedData = {
                labels: uniqueLabels,
                datasets: response?.data?.reduce((datasets, data) => {
                    const existingDataset = datasets.find(dataset => dataset.label === data.subject);

                    if (existingDataset) {
                        // Find the index of the label in uniqueLabels and add data at the same index
                        const index = uniqueLabels.indexOf(data.month);
                        existingDataset.data[index] += data.total_trainings;
                    } else {
                        const newData = Array(uniqueLabels.length).fill(0);
                        const index = uniqueLabels.indexOf(data.month);
                        newData[index] = data.total_trainings;

                        datasets.push({
                            label: data.subject,
                            data: newData,
                            backgroundColor: `${data?.trainingType === "ROBOTICS" ? "rgba(255, 99, 132, 0.5)" : data.subject === "COMPUTER SCIENCE"? "rgba(50, 58, 168, 0.5)" : data.subject === "AEROMODELLING" ? "rgba(255, 0, 200, 0.5)": "rgba(0, 255, 255, 1)"}`,
                            borderColor: `${data?.subject === "ROBOTICS" ? "rgba(255, 99, 132, 0.5)" : data.subject === "COMPUTER SCIENCE"? "rgba(50, 58, 168, 0.5)" : data.subject === "AEROMODELLING" ? "rgba(255, 0, 200, 0.5)": "rgba(0, 255, 255, 1)"}`,
                        });
                    }

                    return datasets;
                }, []),
            };

            return formattedData
        }
        catch (err) {
            throw new Error(err.message ? err.message : "Can not fetch the statistics");
        }
    }

    const { data: dataset, isLoading: loading } = useQuery({
        queryKey: ["statistics"],
        queryFn: fetch_statistics,
        retry: false,
        refetchOnWindowFocus: false
    })

    return {dataset, loading}
}