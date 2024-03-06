import { Statistic } from 'antd'
import { TableOutlined } from '@ant-design/icons'
import useFilterTraining from '../../../hooks/filter_training'
import { useUserInfo } from '../../../hooks/token_hooks'
import { useTraining } from '../../../hooks/fetch_training'

export function TodaysTrainings() {
  const { userInfo } = useUserInfo()
  const { training, loadingTrainings, runningSubjectTrainings } = useFilterTraining(userInfo?.id)   // To fetch all currently running trainings
  const { trainingsData, trainingBySubject } = useTraining();      // To fetch all all trainings
  return (
    <div className='flex w-full h-full items-center justify-start gap-2'>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={training?.length} title="Today's Training" prefix={<TableOutlined className='mr-2' />} suffix={`/${trainingsData.length}`} loading={loadingTrainings} />
      </div>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={trainingBySubject.cs.length} title="Computer" prefix={<TableOutlined className='mr-2' />} suffix={`/${runningSubjectTrainings.computerScience.length}`} loading={loadingTrainings} />
      </div>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={trainingBySubject.robotics.length} title="Robotics" prefix={<TableOutlined className='mr-2' />} suffix={`/${runningSubjectTrainings.robotics.length}`} loading={loadingTrainings} />
      </div>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={trainingBySubject.aeromodelling.length} title="Aeromodelling" prefix={<TableOutlined className='mr-2' />} suffix={`/${runningSubjectTrainings.aeromodelling.length}`} loading={loadingTrainings} />
      </div>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={trainingBySubject.dc.length} title="Doubt Session" prefix={<TableOutlined className='mr-2' />} suffix={`/${runningSubjectTrainings.doubtSession.length}`} loading={loadingTrainings} />
      </div>

    </div>
  )
}

