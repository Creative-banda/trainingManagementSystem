import React, { useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTrainingStatistics } from '../../hooks/satistics';
import { color } from 'chart.js/helpers';
import { Spin } from 'antd';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            // labels: {
            //     display: true,
            //     color: 'black',
            // }
        },
        title: {
            display: true,
            text: 'Training 2024',
            color: 'black'
        },

    },
};


const LineChart = () => {
    const { fetch_statistics, dataset, statisticsData, loading } = useTrainingStatistics();
    console.log(statisticsData, loading)

    // const dataset = useMemo(() => {
    //     const uniqueLabels = Array.from(new Set(statisticsData?.map(item => item.month)));
    //     const formattedData = {
    //         labels: uniqueLabels,
    //         datasets: statisticsData.length > 0 && statisticsData?.reduce((datasets, data) => {
    //             const existingDataset = datasets.find(dataset => dataset.label === data.subject);

    //             if (existingDataset) {
    //                 // Find the index of the label in uniqueLabels and add data at the same index
    //                 const index = uniqueLabels.indexOf(data.month);
    //                 existingDataset.data[index] += data.total_trainings;
    //             } else {
    //                 const newData = Array(uniqueLabels.length).fill(0);
    //                 const index = uniqueLabels.indexOf(data.month);
    //                 newData[index] = data.total_trainings;

    //                 datasets.push({
    //                     label: data.subject,
    //                     data: newData,
    //                     backgroundColor: `${data?.trainingType === "ROBOTICS" ? "rgba(255, 99, 132, 0.5)" : data.subject === "COMPUTER SCIENCE" ? "rgba(50, 58, 168, 0.5)" : data.subject === "AEROMODELLING" ? "rgba(255, 0, 200, 0.5)" : "rgba(0, 255, 255, 1)"}`,
    //                     borderColor: `${data?.subject === "ROBOTICS" ? "rgba(255, 99, 132, 0.5)" : data.subject === "COMPUTER SCIENCE" ? "rgba(50, 58, 168, 0.5)" : data.subject === "AEROMODELLING" ? "rgba(255, 0, 200, 0.5)" : "rgba(0, 255, 255, 1)"}`,
    //                 });
    //             }

    //             return formattedData;
    //         })
    //     }
    // }, [statisticsData])

    console.log(dataset)

    useEffect(() => {
        fetch_statistics()
    }, [])

    return (
        <div className='flex justify-center shadow-md  items-center w-full h-full rounded-lg border px-4 py-2'>

            {loading ? <Spin spinning={loading} tip="Loading..." /> :
                <Line
                    data={dataset}
                    options={options}
                />
            }
        </div>
    );
};

// Return a memoized version of the component
export default React.memo(LineChart);
