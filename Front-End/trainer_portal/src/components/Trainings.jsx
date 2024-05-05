import { Button, Select, Table, Tag, Tooltip } from 'antd';
import { EyeOutlined, ReloadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useTraining } from '../../hooks/training_hook';
import { useNavigate } from 'react-router-dom';
import { UpdateTrainingModal } from '../../modal/updateTrainingModal';
import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../context/modal_context';
import RequestTraining from '../../modal/request_training';
import { useUserInfo } from '../../hooks/token_hooks';
import { RequestedTrainingStatus, TrainingType } from '../../utilities/MenuItems';


function Training() {
  const [data, setData] = useState()
  const { setUpdateTrainingModal, setRequestTrainingModal } = useContext(ModalContext)
  const redirect = useNavigate();
  const { pagination, setPagination, trainingsData, loadingTraining, fetchTraining } = useTraining();
  const { is_am_om } = useUserInfo();

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
                onClick={() => redirect(`/school/${school.id}`, { state: { school, subject: rest.trainingType } })}
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
        // <p className={`${trainingStatus === "COMPLETED" ? "bg-green-300" : trainingStatus === "ONGOING" ? "bg-yellow-200" : trainingStatus === "CANCELLED" ? "bg-red-300" : "bg-orange-300"} text-center rounded-lg inline px-2`}>{trainingStatus}</p>

        <Tag color={trainingStatus === "COMPLETED" ? "green" : trainingStatus === "ONGOING" ? "yellow" : trainingStatus === "CANCELLED" ? "red" : "orange"}>{trainingStatus}</Tag>
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
      title: "Start Time",
      dataIndex: "startTime",
      key: 4
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
      <UpdateTrainingModal data={data} />
      <RequestTraining />
      <Table columns={columns} dataSource={trainingsData} loading={loadingTraining} pagination={pagination} onChange={handleTableChange} size='small' bordered

        // Title for filtering and other information
        title={() => (
          <div className='flex justify-between'>
            <div className='flex gap-2'>

              <Tooltip title="Refresh Data">
                <Button icon={<ReloadOutlined />} onClick={() => fetchTraining()} size='small' />
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


export const TrainingRequestSheet = () => {
  const { is_am_om, userInfo } = useUserInfo();

  const [filters, setFilters] = useState({
    status: "PENDING",
    requestor: userInfo?.id,
    school: null,
    subject: null,
  });

  const { fetchRequestedTraining, requestedTrainings } = useTraining();

  console.log(requestedTrainings);

  useEffect(() => {
    is_am_om && fetchRequestedTraining(filters);
  }, [])

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
        <Tag color={status === "PENDING" ? "orange" : status === "APPROVED" ? "green" : "red"}>{status}</Tag>
      )
    }
  ]


  return (
    <div>
      <Table
        columns={columns}
        dataSource={requestedTrainings}
        size='small'
        bordered
        title={
          () => (
            <div className='flex gap-2'>
              <Select options={RequestedTrainingStatus} placeholder="Select Status" onChange={(value) => setFilters({ ...filters, status: value })} size='small' allowClear />

              <Select options={TrainingType} placeholder="Select Subject" onChange={(value) => setFilters({ ...filters, subject: value })} size='small' allowClear />

              <Button onClick={() => fetchRequestedTraining(filters)} icon={<SearchOutlined />} type='primary' size='small' />
            </div>
          )
        }
      />
    </div>
  )
}