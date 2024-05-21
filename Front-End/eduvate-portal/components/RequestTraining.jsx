import { Button, Select, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import useRequestTraining from '../hooks/request_training_hook'
import useSchools from '../hooks/fetch_schools';
import { TrainingRequestStatus, TrainingStatus, TrainingType } from '../utils/MenuItems';
import useUserOptions from '../hooks/fetch_user';
import { SearchOutlined } from '@ant-design/icons';
import { TiPointOfInterest } from "react-icons/ti";
// import AddTrainingModal from '../modals/add_training';
// import { ModalContext } from '../context/modal_context';

function RequestTraining() {
    const { fetchRequestedTraining, requestedTraining, loading } = useRequestTraining();
    // const { setTrainingModal} = useContext(ModalContext);

    const { allSchoolOptions } = useSchools();
    const { userName } = useUserOptions();

    const [filters, setFilters] = useState({
        school: "", subject: "", requestor: "", status: "PENDING"
    })
    const [trainingData, setTrainingData] = useState({});

    // console.log(filters);

    const columns = [
        {
            title: "School",
            dataIndex: "school",
            key: 1,
            render: (_, { school }) => (
                <div>
                    {school.name}
                </div>
            )
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: 2,
        },
        {
            title: "Requestor",
            dataIndex: "requestor",
            key: 3,
            render: (_, { requestor }) => (
                <div>
                    {requestor.username}
                </div>
            )
        },
        {
            title: "Date",
            dataIndex: "startDate",
            key: 4,
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: 5,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: 6,
            render: (_, { status }) => (
                <div>
                    <Tag color={status === "PENDING" ? "orange" : "green"}>{status}</Tag>
                </div>
            )
        },
        // {
        //     title: "Assign",
        //     key: 7,
        //     render: (data) => (
        //         <div className='flex gap-2'>
        //             <Button className='bg-green-400 text-white' size='small' icon={<EyeOutlined/>} onClick={() => {
        //                 setTrainingData(data);
        //                 setTrainingModal(true);
        //             }} />
        //         </div>
        //     )
        // }
    ]

    useEffect(() => {
        fetchRequestedTraining(filters);
    }, [])

    return (
        <div className=''>
            {/* <AddTrainingModal data={trainingData} /> */}
            <h1 className='flex gap-2 items-center font-medium'> <TiPointOfInterest/> Training Request </h1>
            <Table columns={columns} loading={loading} dataSource={requestedTraining} bordered size='small'
                title={() => (
                    <div className='flex gap-2'>
                        <Select options={allSchoolOptions} placeholder="Filter By School" className=' w-40' allowClear onSelect={(value) => setFilters({ ...filters, school: value })} onClear={() => setFilters({ ...filters, school: "" })} size='small' />

                        <Select options={TrainingType} placeholder="Filter By Subject" className=' w-40' allowClear onSelect={(value) => setFilters({ ...filters, subject: value })} onClear={() => setFilters({ ...filters, subject: "" })} size='small' />

                        <Select options={userName} placeholder="Filter By Users" className=' w-40' allowClear onSelect={(value) => setFilters({ ...filters, requestor: value })} showSearch optionFilterProp='label' onClear={() => setFilters({ ...filters, requestor: "" })} size='small' />

                        <Select options={TrainingStatus} placeholder="Filter By Status" className=' w-40' allowClear onSelect={(value) => setFilters({ ...filters, status: value })} onClear={() => setFilters({ ...filters, status: "" })} size='small' />

                        <Button type='primary' icon={<SearchOutlined />} onClick={() => fetchRequestedTraining(filters)} size='small'/>
                    </div>
                )}
            />
        </div>
    )
}

export default RequestTraining