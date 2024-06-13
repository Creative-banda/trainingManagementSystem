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
    const { dataset, loading } = useTrainingStatistics();

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
