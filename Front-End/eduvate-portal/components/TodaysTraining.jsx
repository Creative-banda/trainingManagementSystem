import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
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
    const [filters, setFilters] = useState({
        trainers:"", active:true, schools:"",trainingStatus:"ONGOING", trainingType:"", currentGrade:""
    })
    const [trainingType, setTrainingType] = useState(null);
    const [trainingData, setTrainingData] = useState({ })
    const [grade, setGrade] = useState(null);
    const { setEditModal } = useContext(ModalContext);
    const { userName, loading } = useUserOptions();
    const { training, loadingTrainings, fetchTraining } = useFilterTraining(filters);
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
            render: (training) => (

                <div>
                    <Button icon={<EyeOutlined />} onClick={() => {
                        setTrainingData(training);
                        setEditModal(true);
                    }} />
                </div>
            )
        }
    ]

    return (
        <div className='w-full'>
            <EditModal trainingData={trainingData} />
            <Table columns={columns} dataSource={training} loading={loadingTrainings} className='border rounded-lg' size='small' pagination={false}
                title={() => (
                    <div className='flex gap-2'>
                        <Select options={userName} placeholder="Filter By Trainers" allowClear onSelect={(value) => setFilters({...filters, trainers: value})} onClear={() => setFilters({ ...filters, trainers: "" })} loading={loading} size='small' optionFilterProp='label'
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
                            placeholder="Filter By Subject" allowClear onClear={() => setFilters({ ...filters, trainingType: "" })} onSelect={(value) => setFilters({ ...filters, trainingType: value })} size='small' />
                        <div>
                            <Select placeholder="Filter By Running Grade" options={grades} allowClear loading={gradeLoading} onSelect={(value) => setFilters({ ...filters, currentGrade: value })} size='small' onClear={() => setFilters({ ...filters, currentGrade: "" })}
                            />
                        </div>

                        <div>
                            <Button icon={<SearchOutlined/>} type='primary' onClick={() => fetchTraining()} size='small'/>
                        </div>
                    </div>
                )}
            />
        </div>
    )
}

export default TodaysTraining