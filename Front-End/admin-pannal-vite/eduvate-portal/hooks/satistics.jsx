import { useState, useEffect } from "react";
import { useToken } from "./token_hooks";
import api from "../interceptor/axios_interceptor";

export const useTrainingStatistics = () => {
    const {access_token} = useToken()
    const [loading, setLoading] = useState(false);
    const [dataset, setDataSet] = useState({
        labels: [],
        datasets: []
    })
    const fetch_statistics = async () => {
        setLoading(true);
        try {
            const response = await api({
                method: "GET",
                url: "http://localhost:8000/training/statistics/?year=2024&start_month=1&end_month=11",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                }
            })
            // console.log(response.data);
            const uniqueLabels = Array.from(new Set(response.data.map(item => item.month)));
            const formattedData = {
                labels: uniqueLabels,
                datasets: response.data.reduce((datasets, data) => {
                    const existingDataset = datasets.find(dataset => dataset.label === data.trainingType);

                    if (existingDataset) {
                        // Find the index of the label in uniqueLabels and add data at the same index
                        const index = uniqueLabels.indexOf(data.month);
                        existingDataset.data[index] += data.total_trainings;
                    } else {
                        const newData = Array(uniqueLabels.length).fill(0);
                        const index = uniqueLabels.indexOf(data.month);
                        newData[index] = data.total_trainings;

                        datasets.push({
                            label: data.trainingType,
                            data: newData,
                            backgroundColor: `${data?.trainingType === "ROBOTICS" ? "rgba(255, 99, 132, 0.5)" : data.trainingType === "COMPUTER SCIENCE"? "rgba(54, 162, 235, 0.5)" : data.trainingType === "AEROMODELLING" ? "rgba(255, 0, 200, 0.5)": "rgba(0, 255, 255, 1)"}`,
                            borderColor: `${data?.trainingType === "ROBOTICS" ? "rgba(255, 99, 132, 0.5)" : data.trainingType === "COMPUTER SCIENCE"? "rgba(54, 162, 235, 0.5)" : data.trainingType === "AEROMODELLING" ? "rgba(255, 0, 200, 0.5)": "rgba(0, 255, 255, 1)"}`,
                        });
                    }

                    return datasets;
                }, []),
            };
            setLoading(false);
            setDataSet(formattedData);
        }
        catch (err) {
            setLoading(false);
            console.log(err)
        }
    }

    // console.log(dataset);

    useEffect(() => {
        fetch_statistics();
    }, [])

    return {fetch_statistics, dataset, loading}
}