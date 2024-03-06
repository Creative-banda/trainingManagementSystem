import { EyeOutlined } from '@ant-design/icons'
import { Button, Table, Tag } from 'antd'
import useFilterTraining from '../../hooks/filter_training';
import { UpdateTrainingModal } from '../../modal/updateTrainingModal';
import { useContext, useState } from 'react';
import { ModalContext } from '../../context/modal_context';
import TrainingSheetModal from '../../modal/trainingSheetModal';
import { useNavigate } from 'react-router-dom';

function TodaysTraining() {
    const [data, setData] = useState();
    const [schoolData, setSchoolData] = useState();
    const { setUpdateTrainingModal } = useContext(ModalContext);
    const redirect = useNavigate();
    const { training, loadingTrainings } = useFilterTraining();
    // console.log(training)
    const columns = [
        {
            title: "School",
            dataIndex: "schools",
            key: "id",
            render: (_, { id, schools }) => (
                <div key={id} className='flex flex-wrap gap-1 text-white'>
                    {
                        schools.map(school => (
                            <p key={school.id} className='p-1 bg-green-400 mb-1 rounded-lg cursor-pointer hover:bg-green-500 transition'
                            onClick={() => redirect(`/school/${school.id}`, { state: school})}
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
            key: "id",
            render: (_, { trainingType }) => (
                <p>{trainingType}</p>
            )
        },
        {
            title: "Action",
            key: "id",
            render: (data) => (
                <div>
                    <Button icon={<EyeOutlined />} onClick={() => {
                        setData(data);
                        setUpdateTrainingModal(true);
                    }} />
                </div>
            )
        }
    ]

    return (
        <div className='w-full'>
            <UpdateTrainingModal data={data} />
            <TrainingSheetModal school={schoolData}/>
            <Table columns={columns} loading={loadingTrainings} dataSource={training} size='small' />
        </div>
    )
}

export default TodaysTraining