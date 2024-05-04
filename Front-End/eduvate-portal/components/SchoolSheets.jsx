import React, { useEffect, useState } from 'react'
import { Button, Select, Tooltip } from 'antd'
import { SchoolSheet } from './TrainingSheet'
import { CiSearch } from "react-icons/ci";
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import useSchools from '../hooks/fetch_schools';
import { useSheet } from '../hooks/fetch_sheet';
import { useUserInfo } from '../hooks/token_hooks';
import { TrainingType } from '../utils/MenuItems';

function SchoolSheets() {
    const { schoolOptions, fetchingSchool } = useSchools();
    
    const [schoolId, setSchoolId] = useState();
    const [subject, setSubject] = useState("COMPUTER SCIENCE");
    const {is_am_om} = useUserInfo();
    const redirect = useNavigate();


    const filterSchoolById = (id) => {
        setSchoolId(id);
    }

    useEffect(() => {
        !is_am_om && redirect("/")
    }, [is_am_om])

    return (
        
        <div className='flex w-full flex-col gap-2'>

            <div className='w-full flex gap-4'>
                <Select options={schoolOptions} placeholder="Select School" showSearch optionFilterProp='label' allowClear className='w-56' onSelect={filterSchoolById} suffixIcon={<CiSearch />} onClear={() => setSchoolId(null)} loading={fetchingSchool} />

                <Select options={TrainingType} placeholder="Search the Subject" showSearch optionFilterProp='label' allowClear className='w-56' onSelect={(value) => setSubject(value)} suffixIcon={<CiSearch />} loading={fetchingSchool} />
            </div>

            <div className='w-full'>
                <SheetBody schoolId={schoolId} subject={subject} />
            </div>

        </div>
    )
}

export default SchoolSheets


export const SheetBody = ({ schoolId, subject }) => {
    const {sheetData, fetchSchoolSheet, loading} = useSheet({ id: schoolId, subject: subject });
    // console.log(CSData);



    return (
        <div className='w-full flex flex-col gap-2'>
            <SchoolSheet dataSource={sheetData} loading={loading} title={() =>
                <div className='flex gap-2 items-center'>
                    <Tooltip title="Refresh">
                        <Button icon={<ReloadOutlined />} onClick={() => fetchSchoolSheet()} disabled={schoolId ? false : true} />
                    </Tooltip>

                    <Tooltip title="Add Training">
                        <Button icon={<PlusOutlined />} />
                    </Tooltip>
                </div>
            }
                subject="COMPUTER SCIENCE" />
        </div>
    )
}