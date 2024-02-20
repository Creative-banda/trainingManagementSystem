import React from 'react'
import TodaysTraining from './TodaysTraining'
import LineChart from './Charts/TrainingChart'
import { DoughnutChart } from './Charts/TrainingStatusDougnutChart'

function Dashboard() {
    return (
        <div className='grid grid-cols-2 gap-4 w-full h-full'>
            <div>
                <LineChart />
            </div>
            <div>
                <DoughnutChart />
            </div>
            <div className='col-span-2'>
                <TodaysTraining />
            </div>
        </div>
    )
}

export default React.memo(Dashboard)