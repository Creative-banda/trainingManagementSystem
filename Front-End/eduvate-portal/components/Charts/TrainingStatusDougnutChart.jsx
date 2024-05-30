import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAllTrainings } from '../../hooks/fetch_training';
import { Spin } from 'antd';

ChartJS.register(ArcElement, Tooltip, Legend);

const labels = ['ROBOTICS', 'COMPUTER SCIENCE', 'AEROMODELLING', 'DC SESSION']
const backgroundColor = [
  'rgba(255, 99, 132, 0.5)',
  'rgba(200, 162, 235, 0.5)',
  'rgba(255, 0, 200, 0.5)',
  'rgba(0, 255, 255, 0.5)',
]
const borderColor = [
  'rgba(255, 99, 132, 0.5)',
  'rgba(200, 162, 235, 0.5)',
  'rgba(255, 0, 200, 0.5)',
  'rgba(0, 255, 255, 0.5)',
]
const borderWidth = 1

const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      rtl: true,
      labels: {
        usePointStyle: true,
        padding: 20,
      }
    },
    title: {
      display: true,
      fontSize: 20, // <--- this is not a managed option since CHART.JS 3
      text: 'Training Status'
    }
  },
}



const DoughnutChart = () => {
  const { robotics, cs, aeromodelling, dc, loading } = useAllTrainings();

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Training Status',
        data: [robotics?.length, cs?.length, aeromodelling?.length, dc?.length],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: borderWidth,
      },
    ],
  };
  return (
    <div className='flex justify-center items-center w-full h-full shadow-md'>
      {
        loading ? <Spin spinning={loading} tip="Loading..." /> :
          <Doughnut data={data} options={options} />
      }
    </div>
  )

}


export default React.memo(DoughnutChart);
