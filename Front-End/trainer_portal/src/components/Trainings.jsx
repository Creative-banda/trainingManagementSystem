// import React, { useState } from 'react'
import { Button, Table, Tooltip } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTraining } from '../../hooks/training_hook';
import { useNavigate } from 'react-router-dom';
import { UpdateTrainingModal } from '../../modal/updateTrainingModal';
import { useContext, useState } from 'react';
import { ModalContext } from '../../context/modal_context';
import {PlusOutlined} from '@ant-design/icons';
import RequestTraining from '../../modal/request_training';


function Training() {
  const [data, setData] = useState()
  const {setUpdateTrainingModal, setRequestTrainingModal} = useContext(ModalContext)
  const redirect = useNavigate();
  const { pagination, setPagination, trainingsData, loadingTraining, fetchTraining } = useTraining();
  
  const columns = [
    {
      title: "Schools",
      dataIndex: "schools",
      key: 1,
      render: (_, rest) => (
        <div className='flex flex-wrap gap-1 text-white'>
          {
            rest.schools?.map((school) => (
              <p key={school.id} role='button' className='p-1 bg-green-400 mb-1 rounded-lg cursor-pointer hover:bg-green-500 transition'
                onClick={() => redirect(`/school/${school.id}`, { state: { school, subject: rest.trainingType} })}
              >
                {school.name}
              </p>
            ))
          }
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "trainingStatus",
      key: 2,
      render: (_, { trainingStatus }) => (
        <p className={`${trainingStatus === "COMPLETED" ? "bg-green-300" : trainingStatus === "ONGOING" ? "bg-yellow-200" : trainingStatus === "CANCELLED" ? "bg-red-300" : "bg-orange-300"} text-center rounded-lg inline px-2`}>{trainingStatus}</p>
      ),
      filters: [
        { text: "Completed", value: "COMPLETED" },
        { text: "Pending", value: "PENDING" },
        { text: "On Going", value: "ONGOING" },
        { text: "Cancelled", value: "CANCELLED" },
      ],
      onFilter: (value, record) => record?.trainingStatus.indexOf(value) === 0,
    },
    {
      title: "Training Type",
      dataIndex: "trainingType",
      key: 3,
      render: (_, { trainingType }) => (
        <p className=''>{trainingType}</p>
      ),
      filters: [
        { text: "CS", value: "COMPUTER SCIENCE" },
        { text: "Robotics", value: "ROBOTICS" },
        { text: "Aero", value: "AEROMODELLING" },
      ],
      onFilter: (value, record) => record?.trainingType.indexOf(value) === 0,
    },
    {
      title : "Start Time",
      dataIndex : "startTime",
      key : 4
    },
    {
      title: "Action",
      key: 5,
      render: (data) => (
        <div className='flex gap-2'>
          <Tooltip title="View Or Edit">
            <Button icon={<EyeOutlined />} onClick={() => {
              setData(data);
              setUpdateTrainingModal(true);
            }} />
          </Tooltip>
        </div>
      )
    }

  ]


  const handleTableChange = (pagination) => {
    setPagination(pagination);
  }

  return (
    <div className='w-full h-full'>
      <UpdateTrainingModal data={data}/>
      <RequestTraining/>
      <Table columns={columns} dataSource={trainingsData} loading={loadingTraining} pagination={pagination} onChange={handleTableChange} size='small' bordered

        // Title for filtering and other information
        title={() => (
          <div className='flex justify-between'>

            <div className='flex gap-4'>
              <Tooltip title="Refresh Data">
                <Button icon={<ReloadOutlined />} onClick={() => fetchTraining()} />
              </Tooltip>

              <Tooltip title="Request Training">
                <Button icon={<PlusOutlined />} onClick={() => setRequestTrainingModal(true)} />
              </Tooltip>
            </div>
          </div>

        )}
      />
    </div>
  )
}

export default Training