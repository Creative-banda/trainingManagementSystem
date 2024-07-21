import { Button, Form, Input, Select, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaAddressCard, FaPhoneAlt, FaUserFriends, FaUserCog } from "react-icons/fa";
import { MdOutlineAlternateEmail, MdNumbers } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { useTrainings } from '../hooks/fetch_training';
import { useSchoolById } from '../hooks/fetch_schools';
import useSubjects from '../hooks/subject_hook';


function SchoolProfile() {
  const [form] = Form.useForm()
  const [teachers, setTechers] = useState([]);
  const redirect = useNavigate();
  const navigate = useLocation();
  const { data } = navigate.state;
  
  const { school, updateSchoolMutate } = useSchoolById(data?.id);
  const { subjects, loading } = useSubjects();
  const { setFilter, filter, trainingsData, loadingTraining } = useTrainings();

  // To add the teacher in the list
  const handleSubmit = (value) => {
    setTechers([...teachers, value]);
    form.resetFields();
  }

  // To patch the teacher to the server
  const addTeacher = () => {
    const dataForm = {
      teachers: teachers
    }
    updateSchoolMutate(JSON.stringify(dataForm));
    setTechers([]);
  }


  const removeTeacher = (value) => {
    // console.log(value);
    const newTeachers = teachers.filter(teacher => teacher.name !== value);
    setTechers(newTeachers);
  }

  const columns = [
    {
      key: 1,
      title: "School Name",
      dataIndex: "trainingDetail",
      render: (_, { trainingDetail }) => <p className=' cursor-pointer hover:bg-teal-500 hover:text-white rounded-md px-1 transition' onClick={() => redirect(`/school/${data.id}`, { state: { school: data, subject: trainingDetail[0]?.subject } })}>{trainingDetail[0]?.school?.name}</p>
    },
    {
      key: 2,
      title: "Subject",
      dataIndex: "trainingDetail",
      render: (text, { trainingDetail }) => trainingDetail[0]?.subject,
    },
    {
      key: 3,
      title: "Grade",
      dataIndex: "trainingDetail",
      render: (text, { trainingDetail }) => (
        <div>
          {trainingDetail[0]?.grades.map((grade) => (
            <Tag key={grade.id} color="blue">
              {grade.grades}
            </Tag>
          ))}
        </div>
      )
    },
    {
      key: 4,
      title: "Trainer",
      dataIndex: "trainer",
      render: (text, { trainer }) => trainer?.username ? trainer.username : trainer?.email
    },
    {
      key: 5,
      title: "Status",
      dataIndex: "trainingStatus",
    }
  ]

  useEffect(() => {
    setFilter({ ...filter, trainings__school: data.id })
  }, [data])

  return (
    <div className='flex flex-col gap-2 w-full h-full'>
      <div className='flex gap-2 w-full h-full'>
        <div className='rounded-md bg-emerald-400 p-4 h-full w-1/4 shadow-md'>
          <h1 className='font-bold text-white text-2xl'> {data?.name} </h1>
          <p className='flex gap-2 items-center'> <FaAddressCard /> {data?.address} </p>
          <p className='text-blue-800 flex gap-2 items-center'> <MdOutlineAlternateEmail /> {data?.email ? data.email : "Not Provided"} </p>
          <p className='flex gap-2 items-center'> <FaPhoneAlt /> {data?.contact} </p>
          <p className='flex gap-2 items-center'> <MdNumbers /> {data?.erp_code} </p>
          <div>
            {
              data?.grades?.map(grade => (
                <Tag key={grade.id} color='blue'> {grade.grades} </Tag>
              ))
            }
          </div>
          <p className='flex gap-2 items-center'> <FaUserFriends /> {data?.am.username} </p>
          <p className='flex gap-2 items-center'> <FaUserCog /> {data?.om.username} </p>
        </div>

        {/* Register teachers */}
        <div className='p-4 border rounded-md shadow-md h-fit w-1/4'>
          <h1 className='font-bold text-xl'>Register a Teacher</h1>
          <Form form={form} layout='vertical' onFinish={handleSubmit} >
            <Form.Item name='name' label='Name' rules={[{ required: true, message: "Teacher Name can not be empty" }]}>
              <Input placeholder='Enter Teacher Name' />
            </Form.Item>
            <Form.Item name='subject' label='Select the subject' rules={[{ required: true, message: "Subject can not be empty" }]}>
              <Select mode='multiple' placeholder='Select Subjects' options={subjects} showSearch loading={loading} allowClear />
            </Form.Item>
            <div className='flex gap-2'>
              <Form.Item >
                <Button type='primary' htmlType='submit'>Register</Button>
              </Form.Item>
              <Form.Item>
                <Button type='default' onClick={() => addTeacher()} disabled={teachers.length <= 0} >Submit</Button>
              </Form.Item>
            </div>

          </Form>
          <div className='flex'>
            {
              teachers && teachers?.map(teacher => (
                <Tag key={teacher.id} closable color='blue' onClose={(e) => {
                  e.preventDefault();
                  removeTeacher(teacher.name)
                }} > {teacher.name} </Tag>
              ))
            }
          </div>
        </div>

        <div className='flex rounded-md gap-1 flex-wrap border p-2 w-full'>
          {
            school?.teachers?.map(teacher => (
              <TeacherCard key={teacher.id} name={teacher.name} subjects={teacher.subject} />
            ))
          }
        </div>
      </div>

      <Table columns={columns} dataSource={trainingsData} loading={loadingTraining} />

    </div>
  )
}

export default SchoolProfile



export const TeacherCard = ({ name, subjects }) => {
  return (
    <div className='p-4 border rounded-md shadow-md w-fit h-fit'>
      <h1 className='font-bold'>{name}</h1>
      <div>
        {
          subjects?.map(subject => (
            <Tag key={subject.id} color='blue'> {subject.name} </Tag>
          ))
        }
      </div>
    </div>
  )
}