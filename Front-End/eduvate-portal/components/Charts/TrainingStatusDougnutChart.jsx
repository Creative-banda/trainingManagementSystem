import React, { useMemo } from 'react';
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
  const { loading, trainingsData} = useAllTrainings();

  const chartData = useMemo(() => {
    const data = {
      cs: 0,
      robotics: 0,
      aeromodelling: 0,
      dc: 0
    }

    const cs = trainingsData?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "COMPUTER SCIENCE")
    const robotics = trainingsData?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "ROBOTICS")
    const aeromodelling = trainingsData?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "AEROMODELLING")
    const dc = trainingsData?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "DOUBT SESSION")

    data.cs = cs?.length
    data.robotics = robotics?.length
    data.aeromodelling = aeromodelling?.length
    data.dc = dc?.length
    return data

  }, [trainingsData])

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Training Status',
        data: [chartData.robotics, chartData.cs, chartData.aeromodelling, chartData.dc],
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
