import { TableOutlined, UserOutlined } from "@ant-design/icons"
import { Statistic } from "antd"
import { useAllTrainings, useTrainings } from "../hooks/fetch_training"
import useUserOptions from "../hooks/fetch_user"
import useFilterTraining from "../hooks/filter_training"

export const TotalTrainings = () => {
    const { trainingsData, loading } = useAllTrainings()
    const ongoingTrainings = trainingsData?.filter(training => training.trainingStatus === "ONGOING");
    // console.log(ongoingTrainings);
    return (
        <div className="px-6 py-2 border-b-4 border-amber-400 rounded-lg border cursor-pointer">
            <Statistic title="Total Training" value={ongoingTrainings?.length} prefix={<TableOutlined />} suffix={`/ ${trainingsData?.length}`} loading={loading} />
        </div>
    )
}

export const TotalTrainers = () => {
    const { userName, loading } = useUserOptions();
    return (
        <div className="px-6 py-2 border-b-4 border-emerald-400 rounded-lg border cursor-pointer">
            <Statistic title="Total Trainers" value={userName ? userName?.length : "Error !"} prefix={<UserOutlined />} loading={loading} />
        </div>
    )
}


export const CSTraining = () => {
    const { cs, loading, robotics, aeromodelling, dc } = useAllTrainings();
    const { ccs, crobotics, caeromodelling, cdc } = useFilterTraining();
    return (
        <div className="flex gap-4 overflow-x-auto">
            <div className="px-6 py-2 border-b-4 border-purple-300 rounded-lg border cursor-pointer">
                <Statistic title="Computer Science" value={ccs.length} prefix={<TableOutlined />} suffix={`/${cs.length}`} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 border-red-300 rounded-lg border cursor-pointer">
                <Statistic title="Robotics" value={crobotics.length} prefix={<TableOutlined />} suffix={`/${robotics.length}`} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 border-pink-400 rounded-lg border cursor-pointer">
                <Statistic title="Aeromodelling" value={caeromodelling.length} prefix={<TableOutlined />} suffix={`/${aeromodelling.length}`} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 border-cyan-400 rounded-lg border cursor-pointer">
                <Statistic title="Doubt Session" value={cdc.length} prefix={<TableOutlined />} suffix={`/${dc.length}`} loading={loading} />
            </div>
        </div>
    )
}



