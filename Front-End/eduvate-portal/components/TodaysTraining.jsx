import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { TiPointOfInterest } from "react-icons/ti";
import { Button, Select, Table, Tag } from 'antd'
import React, { useContext, useState } from 'react'
import useUserOptions from '../hooks/fetch_user'
import EditModal from '../modals/edit';
import { ModalContext } from '../context/modal_context';
import useFilterTraining from '../hooks/filter_training';
import useGrades from '../hooks/fetch_grades';
import { TrainingType } from '../utils/MenuItems';

function TodaysTraining() {
    const [filters, setFilters] = useState({
        trainer: "", active: true, trainings__subject: "", trainingStatus: "ONGOING", subject: "", currentGrade: ""
    });
    const [trainingData, setTrainingData] = useState({});
    const { setEditModal } = useContext(ModalContext);
    const { userName, loading } = useUserOptions();
    const { training, loadingTrainings, fetchTraining } = useFilterTraining(filters);
    const { grades, gradeLoading } = useGrades();
    // console.log(training);

    const columns = [
        {
            key: 1,
            title: "School",
            dataIndex: "trainingDetail",
            render: (_, { trainingDetail }) => (
                <div className='flex flex-wrap' >
                    {
                        trainingDetail?.map(training => (
                            <p key={training?.school?.id}>{training?.school?.name}</p>
                        ))
                    }
                </div>
            )
        },
        {
            key: 2,
            title: "Trainer",
            dataIndex: "trainer",
            render: (trainer) => (
                <div>
                    {
                        <h1> {trainer?.username} </h1>
                    }
                </div>
            )
        },
        {
            key: 3,
            title: "Action",
            render: (training) => (

                <div>
                    <Button icon={<EyeOutlined />} onClick={() => {
                        console.log(training);
                        setTrainingData(training);
                        setEditModal(true);
                    }} />
                </div>
            )
        }
    ]

    return (
        <div className='w-full'>
            <h1 className='flex gap-2 items-center font-medium'> <TiPointOfInterest /> Today's Training</h1>
            <EditModal trainingData={trainingData} />
            <Table columns={columns} dataSource={training} loading={loadingTrainings} className='border rounded-lg' size='small' pagination={false}
                title={() => (
                    <div className='flex gap-2'>
                        <Select options={userName} placeholder="Filter By Trainer" allowClear onChange={(value) => setFilters({ ...filters, trainer: value })} loading={loading} size='small' optionFilterProp='label' optionRender={(user) => (
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
                            placeholder="Filter By Subject" allowClear onChange={(value) => setFilters({ ...filters, trainings__subject: value })} size='small' />
                        <div>
                            <Select placeholder="Filter By Running Grade" options={grades} allowClear loading={gradeLoading} onChange={(value) => setFilters({ ...filters, currentGrade: value })} size='small'
                            />
                        </div>

                        <div>
                            <Button icon={<SearchOutlined />} type='primary' onClick={() => fetchTraining()} size='small' />
                        </div>
                    </div>
                )}
            />
        </div>
    )
}

export default TodaysTraining