import { Statistic } from 'antd'
import { TableOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import React from 'react'

function TodaysTraining() {
  return (
    <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={3} title="Today's Training" prefix={<TableOutlined />}/>
    </div>
  )
}

export default TodaysTraining

export function TotalTrainings () {
  return (
    <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
      <Statistic title="Total Trainings" prefix={<UsergroupAddOutlined/>} value={12}/>
    </div>
  )
}

