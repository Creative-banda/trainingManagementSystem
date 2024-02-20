import { EyeOutlined } from '@ant-design/icons'
import { Button, Select, Table, Tag } from 'antd'
import React, { useContext, useState } from 'react'
import useUserOptions from '../hooks/fetch_user'
import EditModal from '../modals/edit';
import { ModalContext } from '../context/modal_context';
import useFilterTraining from '../hooks/filter_training';
import useGrades from '../hooks/fetch_grades';
import { TrainingType } from '../utils/MenuItems';

function TodaysTraining() {
    const [userId, setUserId] = useState("")
    const [trainingType, setTrainingType] = useState(null);
    const [trainingId, setTrainingId] = useState(null);
    const [grade, setGrade] = useState(null);

    const { setEditModal } = useContext(ModalContext);

    const { userName, loading } = useUserOptions();
    const { training, loadingTrainings } = useFilterTraining(userId, trainingType, grade);
    const {grades, gradeLoading} = useGrades();
    // console.log(training);

    const columns = [
        {
            title: "School",
            dataIndex: "schools",
            key: "id",
            render: (_, { id, schools }) => (
                <div key={id}>
                    {
                        schools.map(({ id, name }) => (
                            <p key={id}>{name}</p>
                        ))
                    }
                </div>
            )
        },
        {
            title: "Trainer",
            dataIndex: "trainers",
            key: "id",
            render: (_, { id, trainers }) => (
                <div key={id}>
                    {
                        trainers.map(({ id, username }) => (
                            <p key={id}>{username}</p>
                        ))
                    }
                </div>
            )
        },
        {
            title: "Action",
            key: "id",
            render: ({ id }) => (

                <div>
                    <Button icon={<EyeOutlined />} onClick={() => {
                        setTrainingId(id);
                        setEditModal(true);
                    }} />
                </div>
            )
        }
    ]

    return (
        <div className='w-full'>

            <Table columns={columns} dataSource={training} loading={loadingTrainings} scroll={{ y: 200 }} size='small' pagination={false}
                title={() => (
                    <div className='flex justify-around'>
                        <Select options={userName} placeholder="Filter By Trainers" allowClear onSelect={(value) => setUserId(value)} onClear={() => setUserId("")} loading={loading} size='small'
                            optionRender={(user) => (
                                <div className='flex justify-between flex-wrap'>
                                    <span>{user.data.label}</span>
                                    <span className={`${user.data.desc < 4 ? "text-green-400" : "text-red-400"}`}>{user.data.desc}</span>
                                </div>
                            )
                            }
                            showSearch
                        />
                        <Select
                            options={TrainingType}
                            placeholder="Filter By Subject" allowClear onClear={() => setTrainingType("")} onSelect={(value) => setTrainingType(value)} size='small' />
                        <div>
                            <Select placeholder="Filter By Grade" options={grades} allowClear loading={gradeLoading} onSelect={(value) => setGrade(value)} size='small' onClear={() => setGrade(null)}
                            />
                        </div>
                    </div>
                )}
            />

            <EditModal id={trainingId} />
        </div>
    )
}

export default TodaysTraining