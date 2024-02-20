import React, { useEffect, useState } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio, Select, Tag } from 'antd';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const customizeRequiredMark = (label, { required }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);


function SchoolRegistration() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([])
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('optional');
  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  const gradeOptions = grades.map(({ id, grades }) => (
    {
      value: id,
      label: grades
    }
  ))

  const userOptions = users.map(({ user }) => (
    {
      value: user?.id,
      label: user?.username
    }
  ))

  const catagoryOptions = [
    {
      value: 'Category A',
      label: 'Category A',
    },
    {
      value: 'Category B',
      label: 'Category B',
    },
    {
      value: 'Category C',
      label: 'Category C',
    },
    {
      value: 'Category D',
      label: 'Category D',
    }
  ]



  useEffect(() => {
    setLoading(true);
    (async () => {
      await axios.get(`${BASE_URL}/school/grades`)
        .then(response => {
          console.log(response.data);
          setLoading(false);
          setGrades(response.data);
        }).catch(err => {
          setLoading(false);
          console.log(err);
        })
    })()
  }, [])

  useEffect(() => {
    setLoading(true);
    (async () => {
      await axios.get(`${BASE_URL}/accounts/users/`)
        .then(response => {
          console.log(response.data);
          setUsers(response.data);
          setLoading(false);
        }).catch(err => {
          console.log(err);
          setLoading(false);
        })
    })()
  }, [])



  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          requiredMarkValue: requiredMark,
        }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark === 'customize' ? customizeRequiredMark : requiredMark}
        className='flex w-screen'
      >
        <div>

          <Form.Item label="School Name" required tooltip="Write a proper Name of the school">
            <Input placeholder="School Name" className='rounded-lg' required />
          </Form.Item>

          <Form.Item
            label="Address" required
            tooltip={{
              title: 'Write full address of the school',
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input placeholder="Full Address" className='rounded-lg' />
          </Form.Item>

          <Form.Item
            label="Catagory" required
            tooltip={{
              title: 'School Category',
              icon: <InfoCircleOutlined />,
            }}
          >
            <Select options={catagoryOptions} size='large' placeholder="School Catagory" className='border rounded-lg' allowClear />
          </Form.Item>

          <Form.Item
            label="Address" required
            tooltip={{
              title: 'Write full address of the school',
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input placeholder="Full Address" className='rounded-lg' />
          </Form.Item>

        </div>

        <div className=''>
          <Form.Item
            label="Academic Manager" required
            tooltip={{
              title: 'Select Academic Manager Name',
              icon: <InfoCircleOutlined />
            }}
          >
            <Select options={userOptions} placeholder="Select Academic Manager Name" className='rounded-lg' size='large' />
          </Form.Item>

          <Form.Item
            label="Operational Manager" required
            tooltip={{
              title: 'Select Operational Manager Name',
              icon: <InfoCircleOutlined />
            }}
          >
            <Select options={userOptions} placeholder="Select Academic Manager Name" className='rounded-lg' size='large' />
          </Form.Item>
        </div>

      </Form>
    </div>
  )
}

export default SchoolRegistration