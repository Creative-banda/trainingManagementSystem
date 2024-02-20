import React from 'react'
import TrainingCard from './training-card'
import TrainingChart from './Statistics/Charts'

function Dashboard() {
  return (
    <div className='w-full h-full flex gap-4'>

      <div className='flex gap-2 justify-start items-start p-2 rounded-lg border flex-wrap'>
        <TrainingCard school="Radcliffe Healthcare" startTime="12:00" status={"ONGOING"} />
        <TrainingCard school="Radcliffe Healthcare" startTime="12:00" status={"COMPLETED"} />
        <TrainingCard school="Radcliffe Healthcare" startTime="12:00" status={"CANCELLED"} />
      </div>

      <div className='border mb-4 rounded-lg'>
        <TrainingChart/>
        <p> hi </p>
      </div>

    </div>
  )
}

export default Dashboard