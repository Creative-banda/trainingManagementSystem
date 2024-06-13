import { Button, Select, Table, Tag, Tooltip } from 'antd';
import { EyeOutlined, ReloadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useTraining } from '../../hooks/training_hook';
import { useNavigate } from 'react-router-dom';
import { UpdateTrainingModal } from '../../modal/updateTrainingModal';
import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../context/modal_context';
import RequestTraining from '../../modal/request_training';
import { useUserInfo } from '../../hooks/token_hooks';
import { TrainingStatus, TrainingType } from '../../utilities/MenuItems';


function Training() {
  const [data, setData] = useState()
  const { setUpdateTrainingModal, setRequestTrainingModal } = useContext(ModalContext)
  const { pagination, setPagination, trainingsData, loadingTraining, refetchTrainings } = useTraining();
  const { is_am_om } = useUserInfo();
  const redirect = useNavigate();

  // console.log(trainingsData);

  const columns = [
    {
      key: 1,
      title: "Schools",
      dataIndex: "trainingDetail",
      render: (_, { trainingDetail }) => (
        <div className='flex flex-wrap gap-1 text-white'>
          {
            trainingDetail?.map(({ school, subject }) => (
              <p key={school.id} role='button' className='p-1 bg-green-400 mb-1 rounded-lg cursor-pointer hover:bg-green-500 transition'
                onClick={() => redirect(`/school/${school.id}`, { state: { school, subject: subject } })}
              >
                {school.name}
              </p>
            ))
          }
        </div>
      )
    },
    {
      key: 2,
      title: "Status",
      dataIndex: "trainingStatus",
      render: (_, { trainingStatus }) => (
        <Tag color={trainingStatus === "COMPLETED" ? "green" : trainingStatus === "ONGOING" ? "yellow" : trainingStatus === "CANCELLED" ? "red" : "orange"}>{trainingStatus}</Tag>
      ),
      filters: [
        { text: "COMPLETED", value: "COMPLETED" },
        { text: "PENDING", value: "PENDING" },
        { text: "ONGOING", value: "ONGOING" },
        { text: "CANCELLED", value: "CANCELLED" },
      ],
      onFilter: (value, record) => record?.trainingStatus.indexOf(value) === 0,
    },
    {
      key: 3,
      title: "Subject",
      dataIndex: "trainingDetail",
      render: (_, { trainingDetail }) => (
        <p className=''>{trainingDetail ? trainingDetail[0].subject : "Error"}</p>
      ),
      filters: [
        { text: "COMPUTER SCIENCE", value: "COMPUTER SCIENCE" },
        { text: "ROBOTICS", value: "ROBOTICS" },
        { text: "AEROMODELLING", value: "AEROMODELLING" },
      ],
      onFilter: (value, record) => record?.trainingType.indexOf(value) === 0,
    },
    {
      key: 4,
      title: "Start Date",
      dataIndex: "trainingDetail",
      render:(_, {trainingDetail}) => (
        <p>{trainingDetail ? trainingDetail[0].startDate : "Error"}</p>
      )
    },
    {
      key: 5,
      title: "Start Time",
      dataIndex: "trainingDetail",
      render:(_, {trainingDetail}) => (
        <p>{trainingDetail ? trainingDetail[0].startTime : "Error"}</p>
      )
    },
    {
      title: "Action",
      key: 6,
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
      <UpdateTrainingModal data={data} />
      <RequestTraining />
      <Table columns={columns} dataSource={trainingsData} loading={loadingTraining} pagination={pagination} onChange={handleTableChange} size='small' bordered

        // Title for filtering and other information
        title={() => (
          <div className='flex justify-between'>
            <div className='flex gap-2'>

              <Tooltip title="Refresh Data">
                <Button icon={<ReloadOutlined />} onClick={() => refetchTrainings()} size='small' />
              </Tooltip>

              {
                is_am_om &&
                <Tooltip title="Request Training">
                  <Button icon={<PlusOutlined />} onClick={() => setRequestTrainingModal(true)} size='small' />
                </Tooltip>
              }

            </div>
          </div>
        )}
      />
      {
        is_am_om &&
        <TrainingRequestSheet />
      }
    </div>
  )
}

export default Training


const TrainingRequest = () => {
  const { is_am_om, userInfo } = useUserInfo();
  const { setRequestTrainingModal } = useContext(ModalContext)
  const [trainingData, setTrainingData] = useState(null);

  

  const { requestedTrainings, filters, setFilters } = useTraining();


  const columns = [
    {
      key: 1,
      title: "Requester",
      dataIndex: "requestor",
      render: (data) => <h1>{data?.username}</h1>
    },
    {
      key: 2,
      title: "School",
      dataIndex: "school",
      render: (data) => <h1>{data?.name}</h1>
    },
    {
      key: 3,
      title: "Subject",
      dataIndex: "subject",
    },
    {
      key: 4,
      title: "Start Date",
      dataIndex: "startDate",
    },
    {
      key: 5,
      title: "Start Time",
      dataIndex: "startTime",
    },
    {
      key: 6,
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "PENDING" ? "orange" : status === "COMPLETED" ? "green" : status === "ONGOING" ? "yellow" : "red"}>{status}</Tag>
      )
    },
    {
      key: 7,
      title: "Action",
      render: (data) => (
        <div className='flex gap-2'>
          <Tooltip title="View Or Edit">
            <Button icon={<EyeOutlined />} size='small' onClick={() => {
              setTrainingData(data);
              setRequestTrainingModal(true);
            }} />
          </Tooltip>
        </div>
      )
    }
  ]


  return (
    <div>
      <RequestTraining data={trainingData} />
      <Table
        columns={columns}
        dataSource={requestedTrainings}
        size='small'
        bordered
        title={
          () => (
            <div className='flex gap-2'>
              <Select options={TrainingStatus} placeholder="Select Status" onChange={(value) => setFilters({ ...filters, status: value })} size='small' allowClear />

              <Select options={TrainingType} placeholder="Select Subject" onChange={(value) => setFilters({ ...filters, subject: value })} size='small' allowClear />

              <Button onClick={() => fetchRequestedTraining(filters)} icon={<SearchOutlined />} type='primary' size='small' />
            </div>
          )
        }
      />
    </div>
  )
}

export const TrainingRequestSheet = React.memo(TrainingRequest)