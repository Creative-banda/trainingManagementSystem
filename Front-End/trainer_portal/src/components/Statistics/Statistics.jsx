import { Statistic } from 'antd'
import useFilterTraining from '../../../hooks/filter_training'
import { useUserInfo } from '../../../hooks/token_hooks'
import { useTraining } from '../../../hooks/training_hook'
import { PiChalkboardTeacher } from 'react-icons/pi'
import { FaComputer } from 'react-icons/fa6'
import { BsRobot } from "react-icons/bs";
import { MdOutlineFlight } from 'react-icons/md'
import { FaChalkboardTeacher } from 'react-icons/fa'

export function TodaysTrainings() {
  const { userInfo } = useUserInfo()
  const { training, loadingTrainings, runningSubjectTrainings } = useFilterTraining(userInfo?.id)   // To fetch all currently running trainings
  const { trainingsData, trainingBySubject } = useTraining();      // To fetch all all trainings
  return (
    <div className='flex w-full h-full items-center justify-start gap-2'>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={training?.length} title="Today's Training" prefix={<PiChalkboardTeacher />} suffix={`/${trainingsData?.length}`} loading={loadingTrainings} />
      </div>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={trainingBySubject?.cs?.length} title="Computer" prefix={<FaComputer />} suffix={`/${runningSubjectTrainings?.computerScience?.length}`} loading={loadingTrainings} />
      </div>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={runningSubjectTrainings?.robotics?.length} title="Robotics" prefix={<BsRobot />} suffix={`/${trainingBySubject?.robotics?.length}`} loading={loadingTrainings} />
      </div>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={runningSubjectTrainings?.aeromodelling?.length} title="Aeromodelling" prefix={<MdOutlineFlight />} suffix={`/${trainingBySubject?.aeromodelling?.length}`} loading={loadingTrainings} />
      </div>

      <div className='px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer'>
        <Statistic value={runningSubjectTrainings?.doubtSession?.length} title="Doubt Session" prefix={<FaChalkboardTeacher />} suffix={`/${trainingBySubject?.dc?.length}`} loading={loadingTrainings} />
      </div>

    </div>
  )
}

