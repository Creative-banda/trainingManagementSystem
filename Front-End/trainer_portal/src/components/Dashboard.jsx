import React from 'react'
import TodaysTraining from './TodaysTraining';

function Dashboard() {
  return (
    <div className='w-full h-full grid grid-cols-5 gap-2'>

      <div className='col-span-3 rounded-lg border'>
        <TodaysTraining/>
      </div>

      <div className='border mb-4 col-span-2 w-full rounded-lg'>
        {/* <TrainingSheet/> */}
      </div>

    </div>
  )
}

export default Dashboard;