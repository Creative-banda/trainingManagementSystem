import { Button, Popconfirm, Select, Table } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import useSchools from '../../hooks/fetch_schools'
import { useUserInfo } from '../../hooks/token_hooks';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../context/modal_context';
import SchoolModal from '../../modal/add_school';

function Schools() {
    const { filterSchool, filteredData, fetchingSchool, schoolOptions } = useSchools();
    const { setSchoolModal } = useContext(ModalContext);
    const { is_am_om, userInfo } = useUserInfo();
    const redirect = useNavigate();

    const [schoolData, setSchoolData] = useState();
    const [filters, setFilters] = useState({
        id: "",
        catagory: "",
        am: userInfo?.id,
        om: "",
    })

    const handleRole = (value) => {
        if (value === "AM") {
            setFilters({
                ...filters,
                am: userInfo?.id,
                om: ""
            })
        } else {
            setFilters({
                ...filters,
                om: userInfo?.id,
                am: ""
            })
        }
    }

    const columns = [
        {
            key: 1,
            title: "School Name",
            dataIndex: "name",
        },
        {
            key: 2,
            title: "Category",
            dataIndex: "catagory",
        },
        {
            key: 3,
            title: "AM",
            dataIndex: "am",
            render: (data) => <p>{data.username}</p>
        },
        {
            key: 4,
            title: "OM",
            dataIndex: "om",
            render: (data) => <p>{data.username}</p>
        },
        {
            key: 5,
            title: "Opted Grades",
            dataIndex: "grades",
            render: (data) => <p> {data[0].grades} - {data[data.length - 1].grades} </p>
        },
        {
            key: 6,
            title: "Action",
            render: (data) => (
                <div className='flex gap-2'>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setSchoolData(data);
                        setSchoolModal(true);
                    }} />
                    <Popconfirm title="Are you sure you want to delete this school?">
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </div>
            )
        }
    ]


    useEffect(() => {
        if (!is_am_om) {
            redirect("/")
        }
        filterSchool({ ...filters })
    }, [filters])

    return (
        <div>
            <SchoolModal data={schoolData} resetData={setSchoolData} />
            <Table columns={columns} dataSource={filteredData} loading={fetchingSchool} bordered size='small'
                title={() => (
                    <div className='w-full flex justify-start gap-2'>
                        <Select options={schoolOptions} placeholder="Filter By School" allowClear onChange={(value) => setFilters({ ...filters, id: value })} showSearch optionFilterProp='label' size='small' />

                        <Select options={[
                            { value: "AM", label: "Academic Manager" },
                            { value: "OM", label: "Operational Manager" },
                        ]} onChange={(value) => handleRole(value)} placeholder="Choose your role" defaultValue="Academic Manager" size='small' />

                        <Button className='bg-blue-400 text-white' size='small' onClick={() => setSchoolModal(true)}> Add School </Button>
                    </div>
                )}
            />
        </div>
    )
}

export default Schools