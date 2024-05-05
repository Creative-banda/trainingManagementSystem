import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAllTrainings } from '../../hooks/fetch_training';

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart() {
  const {robotics, cs, aeromodelling, dc} = useAllTrainings();

  const data = {
    labels: ['ROBOTICS', 'COMPUTER SCIENCE', 'AEROMODELLING', 'DC SESSION',],
    datasets: [
      {
        label: 'Training Status',
        data: [robotics?.length, cs?.length, aeromodelling?.length, dc?.length],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(200, 162, 235, 0.5)',
          'rgba(255, 0, 200, 0.5)',
          'rgba(0, 255, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(200, 162, 235, 0.5)',
          'rgba(255, 0, 200, 0.5)',
          'rgba(0, 255, 255, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className='flex justify-center items-center bg-white w-full max-h-96 p-4 rounded-lg border'>
      <Doughnut data={data}/>
    </div>
  )

}
