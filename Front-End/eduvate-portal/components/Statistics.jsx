import { TableOutlined, UserOutlined } from "@ant-design/icons"
import { Statistic } from "antd"
import { useAllTrainings } from "../hooks/fetch_training"
import useUserOptions from "../hooks/fetch_user"
import useFilterTraining from "../hooks/filter_training"


export const HeaderStatistics = () => {
    const { cs, loading, robotics, aeromodelling, dc } = useAllTrainings();
    const { ccs, crobotics, caeromodelling, cdc, fetchTraining } = useFilterTraining({ trainingStatus: "ONGOING", active: true });
    const { userName } = useUserOptions();
    const { trainingsData } = useAllTrainings()
    const ongoingTrainings = trainingsData?.filter(training => training.trainingStatus === "ONGOING");

    // console.log(crobotics);
    return (
        <div className="sm:flex gap-4 overflow-x-auto hidden">

            <div className="px-6 py-2 border-b-4 w-44 border-amber-400 rounded-lg border cursor-pointer">
                <Statistic title="TOTAL TRAININGS" value={ongoingTrainings?.length} prefix={<TableOutlined />} suffix={`/ ${trainingsData?.length ? trainingsData?.length : 0}`} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 w-40 border-emerald-400 rounded-lg border cursor-pointer">
                <Statistic title="TOTAL TRAINERS" value={userName ? userName?.length : ""} prefix={<UserOutlined />} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 w-40 border-purple-300 rounded-lg border cursor-pointer">
                <Statistic title="CS" value={ccs?.length ? ccs?.length : 0} prefix={<TableOutlined />} suffix={`/${cs?.length ? cs?.length : 0}`} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 w-40 border-red-300 rounded-lg border cursor-pointer">
                <Statistic title="ROBOTICS" value={crobotics?.length ? crobotics?.length : 0} prefix={<TableOutlined />} suffix={`/ ${robotics?.length ? robotics?.length : 0}`} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 w-40 border-pink-400 rounded-lg border cursor-pointer">
                <Statistic title="AEROMODELLING" value={caeromodelling?.length? caeromodelling?.length : 0} prefix={<TableOutlined />} suffix={`/${aeromodelling?.length ? aeromodelling?.length : 0}`} loading={loading} />
            </div>

            <div className="px-6 py-2 border-b-4 w-40 border-cyan-400 rounded-lg border cursor-pointer">
                <Statistic title="DOUBT SESSION" value={dc?.length ? dc?.length : 0} prefix={<TableOutlined />} suffix={`/${cdc?.length ? cdc?.length : 0}`} loading={loading} />
            </div>
        </div>
    )
}



