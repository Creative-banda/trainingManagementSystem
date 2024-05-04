import { EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Table, Tag, Tooltip } from 'antd'
import useFilterTraining from '../../hooks/filter_training';
import { UpdateTrainingModal } from '../../modal/updateTrainingModal';
import { useContext, useState } from 'react';
import { ModalContext } from '../../context/modal_context';
import { useNavigate } from 'react-router-dom';

function TodaysTraining() {
    const [data, setData] = useState();
    const { setUpdateTrainingModal } = useContext(ModalContext);
    const redirect = useNavigate();
    const { training, loadingTrainings, fetchTraining } = useFilterTraining();
    // console.log(training)
    const columns = [
        {
            title: "School",
            dataIndex: "schools",
            key: 1,
            render: (_, rest) => (
                <div key={rest.id} className='flex flex-wrap gap-1 text-white'>
                    {
                        rest.schools.map(school => (
                            <p key={school.id} className='p-1 bg-green-400 mb-1 rounded-lg cursor-pointer hover:bg-green-500 transition'
                                onClick={() => redirect(`/school/${school.id}`, { state: { school, subject: rest.trainingType } })}
                            >
                                {school.name}
                            </p>
                        ))
                    }
                </div>
            )
        },
        {
            title: "Subject",
            dataIndex: "trainingType",
            key: 2,
            render: (_, { trainingType }) => (
                <p>{trainingType}</p>
            )
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: 3
        },
        {
            title: "Action",
            key: 4,
            render: (data) => (
                <div>
                    <Button icon={<EyeOutlined />} onClick={() => {
                        // console.log(data);
                        setData(data);
                        setUpdateTrainingModal(true);
                    }} />
                </div>
            )
        },
    ]

    return (
        <div className='w-full'>
            <UpdateTrainingModal data={data} />
            {/* <TrainingSheetModal school={schoolData} /> */}
            <Table columns={columns} loading={loadingTrainings} dataSource={training} size='small'
                title={() => (
                    <div>
                        <Tooltip title="Reload">
                            <Button icon={<ReloadOutlined />} onClick={() => fetchTraining()} />
                        </Tooltip>
                    </div>
                )}
            />
        </div>
    )
}

export default TodaysTraining