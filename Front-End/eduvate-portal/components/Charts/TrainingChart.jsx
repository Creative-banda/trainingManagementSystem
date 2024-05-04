import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTrainingStatistics } from '../../hooks/satistics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Training 2024',
        },
    },
};


const LineChart = () => {
    const {dataset} = useTrainingStatistics();
    return (
        <div className=' flex justify-center items-center bg-white w-full h-full rounded-lg border'>

            <Line
                data={dataset}
                options={options}
            />
        </div>
    );
};

export default LineChart;
