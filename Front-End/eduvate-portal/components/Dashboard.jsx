import React from 'react'
import TodaysTraining from './TodaysTraining'
import LineChart from './Charts/TrainingChart'
import { DoughnutChart } from './Charts/TrainingStatusDougnutChart'
import RequestTraining from './RequestTraining'

function Dashboard() {
    return (
        <div className='grid grid-cols-2 gap-2 w-full h-full'>
            <div className=' h-64 w-full'>
                <LineChart />
            </div>
            <div className='h-64 w-full border rounded-md'>
                <DoughnutChart />
            </div>
            
            <div className=' col-span-2 flex-2 flex flex-col gap-2'>
                <RequestTraining />
                <TodaysTraining />
            </div>

        </div>
    )
}

export default React.memo(Dashboard)