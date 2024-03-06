import { Button, Popover, Table, Tooltip } from 'antd'
import { RollbackOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useSheet } from '../../hooks/fetch_sheet';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ModalContext } from '../../context/modal_context';
import TrainingModifyModal from '../../modal/trainingSheetModal';

function TrainingSheet() {
    const [school, setSchool] = useState({ data: {}, id: "" });
    const { setTrainingSheetModifyState } = useContext(ModalContext);
    const { id } = useParams();
    const { sheetData, loading, deleteSheetData, fetchSchoolSheet } = useSheet({ id: id });
    const redirect = useNavigate();
    const navigate = useLocation()
    const schoolData = navigate.state;

    const openAddSheetData = () => {
        setTrainingSheetModifyState(true);
        setSchool({ data: {}, id: "" });
    }

    console.log(sheetData);
    const columns = [
        {
            title: "Grade",
            dataIndex: "data",
            key: 1,
            render: data => data.grade,
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
                    <Button icon={<EditOutlined />} onClick={() => {

                        setSchool(rest);
                        setTrainingSheetModifyState(true);
                    }

                    } />
                    <Popover
                        trigger="hover"
                        title="Sure want to Delete"
                        content={
                            <div>
                                <Button icon={<DeleteOutlined />} danger onClick={() => { deleteSheetData(rest.id) }} className='w-full'>
                                    Yes
                                </Button>
                            </div>
                        }
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popover>
                </div>
            )
        }
    ]


    return (
        <div className='w-full'>
            <TrainingModifyModal sheetData={school} />
            <div className='w-full px-4 py-2 border rounded-lg mb-4 flex gap-2 bg-teal-400 text-white'>
                <h1 className='font-bold text-lg'>{schoolData.name}</h1>
                <h1>{schoolData.erp_code}</h1>
                <h1>{schoolData.catagory}</h1>
                <h1> {schoolData.grades[0].grades} - {schoolData.grades[schoolData.grades.length - 1].grades}  </h1>

            </div>
            <Table
                className='border rounded-lg'
                columns={columns}
                dataSource={sheetData}
                loading={loading}
                size='small'
                title={() => (
                    <div className='flex gap-2'>
                        <Tooltip title="Back to Dashboard">
                            <Button icon={<RollbackOutlined />} onClick={() => redirect("/")} />
                        </Tooltip>

                        <Tooltip title="Refresh">
                            <Button icon={<ReloadOutlined />} onClick={() => fetchSchoolSheet()} />
                        </Tooltip>

                        <Tooltip title="Add Training">
                            <Button icon={<PlusOutlined />} onClick={() => openAddSheetData()}/>
                        </Tooltip>
                    </div>
                )}
            />
        </div>
    )
}

export default TrainingSheet
