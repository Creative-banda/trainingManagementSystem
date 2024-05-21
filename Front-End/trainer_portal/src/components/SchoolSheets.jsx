import React, { useEffect, useState } from 'react'
import useSchools from '../../hooks/fetch_schools'
import { Button, Select, Tooltip } from 'antd'
import { useSheet } from '../../hooks/fetch_sheet'
import { SchoolSheet } from './TrainingSheet'
import { CiSearch } from "react-icons/ci";
import { ReloadOutlined } from '@ant-design/icons';
import { TrainingType } from '../../utilities/MenuItems'
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../../hooks/token_hooks'

function SchoolSheets() {
    const { schoolOptions, fetchingSchool } = useSchools();
    const [schoolId, setSchoolId] = useState(null);
    const [subject, setSubject] = useState("COMPUTER SCIENCE");
    const { is_am_om } = useUserInfo();
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
                <Select options={schoolOptions} placeholder="Select School" showSearch optionFilterProp='label' allowClear className='w-56' onChange={filterSchoolById} suffixIcon={<CiSearch />} loading={fetchingSchool} />
                <Select options={TrainingType} placeholder="Search the Subject" showSearch optionFilterProp='label' allowClear className='w-56' onSelect={(value) => setSubject(value)} suffixIcon={<CiSearch />} loading={fetchingSchool} defaultValue="COMPUTER SCIENCE" />
            </div>

            <div className='w-full'>
                <SheetBody schoolId={schoolId} subject={subject} />
            </div>

        </div>
    )
}

export default SchoolSheets


export const SheetBody = ({ schoolId, subject }) => {
    const { sheetData, fetchSchoolSheet, loading } = useSheet({ id: schoolId, subject: subject });
    console.log(schoolId)

    useEffect(() => {
        schoolId && fetchSchoolSheet();
    }, [schoolId, subject])

    return (
        <div className='w-full flex flex-col gap-2'>
            <SchoolSheet subject={subject} dataSource={sheetData} loading={loading} title={() =>
                <div className='flex gap-2 items-center'>
                    <Tooltip title="Refresh">
                        <Button icon={<ReloadOutlined />} onClick={() => fetchSchoolSheet()} disabled={schoolId ? false : true} />
                    </Tooltip>
                </div>
            } />
        </div>
    )
}