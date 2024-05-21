import { EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Table, Tag, Tooltip } from 'antd'
import useFilterTraining from '../../hooks/filter_training';
import { UpdateTrainingModal } from '../../modal/updateTrainingModal';
import { useContext, useState } from 'react';
import { ModalContext } from '../../context/modal_context';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../hooks/token_hooks';
import { useEffect } from 'react';

function TodaysTraining() {
    const [data, setData] = useState();
    const { userInfo } = useUserInfo();
    const [filter, setFilter] = useState({trainer: userInfo?.id, trainingStatus: "ONGOING", active: true});
    const { setUpdateTrainingModal } = useContext(ModalContext);
    const redirect = useNavigate();
    const { training, loadingTrainings, fetchTraining } = useFilterTraining();
    // console.log(training)
    const columns = [
        {
            key: 1,
            title: "School",
            dataIndex: "trainingDetail",
            render: trainingDetail => (
                <div key={trainingDetail?.id} className='flex flex-wrap gap-1 text-white'>
                    {
                        trainingDetail?.map(training => (
                            <p key={training?.id} className='px-1 bg-green-400 mb-1 rounded-lg cursor-pointer hover:bg-green-500 transition'
                                onClick={() => redirect(`/school/${training?.school?.id}`, { state: { school: training?.school, subject:training?.subject } })}
                            >
                                {training?.school?.name}
                            </p>
                        ))
                    }
                </div>
            )
        },
        {
            key: 2,
            title: "Subject",
            dataIndex: "trainingDetail",
            render: (_, { trainingDetail }) => (
                <p>{trainingDetail[0]?.subject}</p>
            )
        },
        {
            key: 3,
            title: "Start Time",
            dataIndex: "trainingDetail",
            render: (_, { trainingDetail }) => (
                <p>{trainingDetail[0]?.startTime}</p>
            )
        },
        {
            key: 4,
            title: "Action",
            render: (data) => (
                <div>
                    <Button icon={<EyeOutlined />}
                        size='small'
                        onClick={() => {
                            setData(data);
                            setUpdateTrainingModal(true);
                        }} />
                </div>
            )
        },
    ]

    useEffect(() => {
        fetchTraining( filter );
    }, [])

    return (
        <div className='w-full'>
            <UpdateTrainingModal data={data} />
            {/* <TrainingSheetModal school={schoolData} /> */}
            <Table columns={columns} loading={loadingTrainings} dataSource={training} size='small'
                title={() => (
                    <div>
                        <Tooltip title="Reload">
                            <Button icon={<ReloadOutlined />} onClick={() => fetchTraining( filter )} />
                        </Tooltip>
                    </div>
                )}
            />
        </div>
    )
}

export default TodaysTraining