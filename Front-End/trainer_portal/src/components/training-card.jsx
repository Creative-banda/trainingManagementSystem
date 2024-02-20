import React from 'react'
import { CalendarOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';

function TrainingCard({ school, startTime, status, id }) {
    const trainingIcon = (training) => {
        if (training === "COMPLETED") {
            return (
                <div className='flex gap-2 text-green-500'>
                    {<CheckCircleOutlined />} Status: {training}
                </div>
            )

        } else if (training === "PENDING") {
            return (
                <div className='flex gap-2 text-yellow-500'>
                    {<ExclamationCircleOutlined />} Status: {training}
                </div>
            )
        } else if (training === "ONGOING") {
            return (
                <div className='flex gap-2 text-amber-300'>
                    {<ClockCircleOutlined />} Status: {status}
                </div>
            )
        } else if (training === "CANCELLED") {
            return (
                <div className='flex gap-2 text-red-500'>
                    {<CloseCircleOutlined />} Status: {status}
                </div>
            )
        }
    }
    return (
        <div className='flex gap-2 border px-4 py-2 w-60 rounded-lg'>
            <div className='flex flex-col'>
                <h1 className=' text-slate-400 font-semibold'>{school}</h1>
                <div className='flex flex-col'>
                    <div className='flex gap-2'>
                        <CalendarOutlined /> Start time: {startTime}
                    </div>
                    {trainingIcon(status)}
                </div>
            </div>

            <div>
                <Button icon={<EditOutlined />} />
            </div>
        </div>
    )
}

export default TrainingCard