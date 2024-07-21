import { Button, Popover, Table, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useSheet } from '../../hooks/fetch_sheet';
import { useLocation, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../context/modal_context';
import TrainingModifyModal from '../../modal/trainingSheetModal';
import { useTraining } from '../../hooks/training_hook';

function TrainingSheet() {
    const { id } = useParams();

    const navigate = useLocation()
    const { school, subject } = navigate.state;
    const { sheetData, loading, refetchSchoolSheet } = useSheet({ id: id, subject: subject });
    const { attendanceData, attendanceFilter, setAttendanceFilter } = useTraining();
    const { setTrainingSheetModifyState } = useContext(ModalContext);

    // console.log(school?.teachers);

    const openAddSheetData = () => {
        setTrainingSheetModifyState(true);
    }

    console.log(attendanceData);

    useEffect(() => {
        setAttendanceFilter({
            ...attendanceFilter,
            teachers: school?.teachers?.map(teacher => teacher.id),
            subject: subject
        })
    }, [school, subject])

    return (
        <div>

            <div className='w-full px-4 py-2 border rounded-lg mb-4 flex gap-2 items-center bg-teal-400 text-white'>
                <h1 className='font-bold text-lg'>{school?.name}</h1>
                <h1>{school?.erp_code}</h1>
                <h1 className='font-bold text-lg'>{subject}</h1>
                <h1>{school?.catagory}</h1>
                <h1> Grade {school.grades[0]} - Grade {school.grades[school.grades.length - 1]} </h1>

            </div>

            <SchoolSheet dataSource={sheetData}
                loading={loading}
                subject={subject}
                title={() => (
                    <div className='flex gap-2 items-center'>
                        <Tooltip title="Refresh">
                            <Button icon={<ReloadOutlined />} size='small' onClick={() => refetchSchoolSheet()} />
                        </Tooltip>

                        <Tooltip title="Add Training Update">
                            <Button icon={<PlusOutlined />} size='small' onClick={() => openAddSheetData()} />
                        </Tooltip>
                    </div>
                )} />

        </div>
    )
}

export default TrainingSheet


export const SchoolSheet = ({ dataSource, loading, title, subject }) => {
    const { setTrainingSheetModifyState } = useContext(ModalContext);
    const { deleteSheetDataMutate } = useSheet({ id: 0, subject: "" })
    const [school, setSchool] = useState({ data: {}, id: "" });
    // console.log(sheetData);
    const columns = [
        {
            title: "Grade",
            dataIndex: "data",
            key: 1,
            render: data => data?.grade,
        },
        {
            title: "Topic",
            dataIndex: "data",
            key: 2,
            render: data => data.topic,
        },
        {
            title: "Date",
            dataIndex: "data",
            key: 3,
            render: data => data.date,
        },
        {
            title: "Duration",
            dataIndex: "data",
            key: 4,
            render: data => data.duration,
        },
        {
            title: "Conducted",
            dataIndex: "data",
            key: 5,
            render: data => data.conducted,
        },
        {
            title: "Trainer Remark",
            dataIndex: "data",
            key: 6,
            render: data => data.trainerRemark,
        },
        {
            title: "Action",
            dataIndex: "data",
            key: 7,
            render: (_, rest) => (
                <div className='flex gap-2'>
                    <Button icon={<EditOutlined />} size='small' onClick={() => {
                        setSchool(rest);
                        setTrainingSheetModifyState(true);
                    }} />

                    <Popover
                        trigger="hover"
                        title="Sure want to Delete"
                        content={
                            <div>
                                <Button icon={<DeleteOutlined />} size='small' danger onClick={() => { deleteSheetDataMutate(rest.id) }} className='w-full'>
                                    Yes
                                </Button>
                            </div>
                        }
                    >
                        <Button icon={<DeleteOutlined />} size='small' danger />
                    </Popover>
                </div>
            )
        }
    ]

    return (
        <div className=''>
            <TrainingModifyModal sheetData={school} setSchool={setSchool} subject={subject} />
            <Table
                className='border rounded-lg'
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                size='small'
                title={title}
            />
        </div>
    )
}