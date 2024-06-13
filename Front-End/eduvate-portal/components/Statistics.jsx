import { TableOutlined, UserOutlined } from "@ant-design/icons"
import { Statistic } from "antd"
import { useAllTrainings } from "../hooks/fetch_training"
import useUserOptions from "../hooks/fetch_user"
import useFilterTraining from "../hooks/filter_training"
import { useMemo } from "react"


export const HeaderStatistics = () => {
    const { currentTrainingsData } = useFilterTraining({ trainingStatus: "ONGOING", active: true });
    const { userName } = useUserOptions();
    const { trainingsData, loading} = useAllTrainings()
    const ongoingTrainings = trainingsData?.filter(training => training.trainingStatus === "ONGOING");

    // const allTrainingData = useMemo(() => {
    //     const data = {
    //       cs: 0,
    //       robotics: 0,
    //       aeromodelling: 0,
    //       dc: 0
    //     }
    
    //     const cs = trainingsData?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "COMPUTER SCIENCE")
    //     const robotics = trainingsData?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "ROBOTICS")
    //     const aeromodelling = trainingsData?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "AEROMODELLING")
    //     const dc = trainingsData?.filter(({ trainingDetail }) => trainingDetail[0]?.subject === "DOUBT SESSION")
    
    //     data.cs = cs?.length
    //     data.robotics = robotics?.length
    //     data.aeromodelling = aeromodelling?.length
    //     data.dc = dc?.length
    //     return data
    
    //   }, [trainingsData])

    // console.log(crobotics);
    
    const allTrainingData = useMemo(() => {
        const data = {
          cs: 0,
          robotics: 0,
          aeromodelling: 0,
          dc: 0
        }
        trainingsData?.forEach(training => {
          if (training.trainingDetail[0]?.subject === "COMPUTER SCIENCE") {
            data.cs += 1
          }
          else if (training.trainingDetail[0]?.subject === "ROBOTICS") {
            data.robotics += 1
          }
          else if (training.trainingDetail[0]?.subject === "AEROMODELLING") {
            data.aeromodelling += 1
          }
          if (training.trainingDetail[0]?.subject === "DOUBT SESSION") {
            data.dc += 1
          }
        })
        return data
      }, [trainingsData])

      // console.log(trainingsData);
    
    return (
        <div className="sm:flex gap-4 overflow-x-auto hidden">

            <div className="px-6 py-2 border-b-4 w-44 border-amber-400 rounded-lg border cursor-pointer">
                <Statistic title="TOTAL TRAININGS" value={ongoingTrainings?.length} prefix={<TableOutlined />} suffix={`/ ${trainingsData?.length ? trainingsData?.length : 0}`} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer">
                <Statistic title="TOTAL TRAINERS" value={userName ? userName?.length : ""} prefix={<UserOutlined />} loading={loading} />
            </div>

            {/* CS Statistics */}
            <div className="px-6 py-2 border-b-4 w-40 border-purple-300 rounded-lg border cursor-pointer">
                <Statistic title="CS" value={currentTrainingsData?.cs} prefix={<TableOutlined />} suffix={`/${allTrainingData?.cs}`} loading={loading} />
            </div>

            {/* Robotics Statistics */}
            <div className="px-6 py-2 border-b-4 w-40 border-red-300 rounded-lg border cursor-pointer">
                <Statistic title="ROBOTICS" value={currentTrainingsData?.robotics} prefix={<TableOutlined />} suffix={`/ ${allTrainingData?.robotics}`} loading={loading} />
            </div>

            {/* Aeromodelling Statistics */}
            <div className="px-6 py-2 border-b-4 w-40 border-pink-400 rounded-lg border cursor-pointer">
                <Statistic title="AEROMODELLING" value={currentTrainingsData?.aeromodelling} prefix={<TableOutlined />} suffix={`/${allTrainingData?.aeromodelling}`} loading={loading} />
            </div>

            {/* Doubt Session Statistics */}
            <div className="px-6 py-2 border-b-4 w-40 border-cyan-400 rounded-lg border cursor-pointer">
                <Statistic title="DOUBT SESSION" value={currentTrainingsData?.dc} prefix={<TableOutlined />} suffix={`/${allTrainingData?.dc}`} loading={loading} />
            </div>
        </div>
    )
}



