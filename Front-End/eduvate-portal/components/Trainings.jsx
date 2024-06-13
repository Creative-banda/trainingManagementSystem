import React, { useContext, useState } from 'react'
import { Button, Table, Select, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined, FilterOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { TiPointOfInterest } from "react-icons/ti";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import useUserOptions from '../hooks/fetch_user';
import { ModalContext } from '../context/modal_context';
import EditModal from '../modals/edit';
import { useTrainings } from '../hooks/fetch_training';
import useSchools from '../hooks/fetch_schools';
import RequestTraining from './RequestTraining';
import AddTrainingModal from '../modals/add_training';
import { useNavigate } from 'react-router-dom';
import TransferTrainingModal from '../modals/transfter_training';


export function Training() {
  const [trainingData, setTrainingData] = useState({})
  const { setEditModal, setTrainingModal, setTransferTrainingModal } = useContext(ModalContext);
  const { allSchoolOptions, fetchingAllSchools } = useSchools();
  const { userName } = useUserOptions();
  const { pagination, setPagination, trainingsData, loadingTraining, refetchTrainings, deleteTrainingMutate, setFilter, filter } = useTrainings();

  const redirect = useNavigate();


  const handleFilter = () => {
    // console.log(filter);
    refetchTrainings();
  }


  const columns = [
    {
      key: 1,
      title: "Schools",
      dataIndex: "trainingDetail",
      render: (_, { trainingDetail }) => (
        <div>
          {
            trainingDetail?.map(({ school }) => (
              <div key={school?.id} className='font-medium cursor-pointer hover:bg-emerald-400 hover:text-white rounded-md transition px-1' onClick={() => redirect(`/school/${school.id}`, { state: { school: school, subject: trainingDetail[0].subject } })} >
                {school?.name}
              </div>
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
      key: 3,
      title: "Trainer",
      dataIndex: "trainer",
      render: (_, { trainer }) => (
        <div className='flex flex-wrap gap-2 items-center justify-center'>
          <p className=' bg-lime-300 rounded-lg px-2'> {trainer?.username} </p>
        </div>
      ),

    },
    {
      key: 4,
      title: "Subject",
      dataIndex: "trainingDetail",
      render: (_, { trainingDetail }) => (
        <p className=''>{trainingDetail[0]?.subject}</p>
      ),
      filters: [
        { text: "COMPUTER SCIENCE", value: "COMPUTER SCIENCE" },
        { text: "ROBOTICS", value: "ROBOTICS" },
        { text: "AEROMODELLING", value: "AEROMODELLING" },
      ],
      onFilter: (value, record) => record?.trainingDetail[0]?.subject.indexOf(value) === 0,
    },
    {
      key: 5,
      title: "Action",
      render: (training) => (
        <div className='flex gap-2'>
          <Tooltip title="View Or Edit">
            <Button icon={<EyeOutlined />} size='small' onClick={() => {
              setTrainingData(training);
              setEditModal(true);
            }} />
          </Tooltip>

          <Popconfirm title="Are you sure?" onConfirm={() => deleteTrainingMutate(training.id)} >
            <Button danger icon={<DeleteOutlined />} size='small' />
          </Popconfirm>
        </div>
      )
    }

  ]


  const handleTableChange = (pagination) => {
    setPagination(pagination);
  }

  return (
    <div>
      <h1 className='flex gap-2 items-center font-medium'> <TiPointOfInterest /> All Trainings</h1>
      <EditModal trainingData={trainingData} />
      <AddTrainingModal />
      <TransferTrainingModal />
      <Table columns={columns} dataSource={trainingsData} loading={loadingTraining} pagination={pagination} onChange={handleTableChange} size='small' className='border rounded-lg transition'
        // Title for filtering and other information
        title={() => (
          <div className='flex justify-between'>
            <div className='flex gap-2'>
              <Select placeholder="Search by Trainer" options={userName} onChange={(value) => setFilter({ ...filter, trainer: value })} allowClear showSearch optionFilterProp='label' size='small' className=' w-48'
                optionRender={(user) => (
                  <div className='flex justify-between'>
                    <span>{user.data.label}</span>
                    <span className={`${user.data.desc < 4 ? "text-green-400" : "text-red-400"}`}>{user.data.desc}</span>
                  </div>
                )
                }
              />

              <Select placeholder="Search by School" loading={fetchingAllSchools} allowClear showSearch optionFilterProp='label' options={allSchoolOptions} size='small' className='w-48'
                onChange={(value) => setFilter({ ...filter, trainings__school: value })}
              />

              <Button type='primary' icon={<SearchOutlined />} onClick={() => handleFilter()} size='small' />

            </div>

            <div className='flex gap-2'>

              <Tooltip title="Transfer">
                <Button icon={<FaMoneyBillTransfer />} onClick={() => setTransferTrainingModal(true)} size='small' />
              </Tooltip>

              <Tooltip title="Add Training">
                <Button icon={<PlusOutlined />} onClick={() => setTrainingModal(true)} size='small' />
              </Tooltip>

              <Tooltip title="Refresh">
                <Button icon={<ReloadOutlined />} onClick={() => handleFilter()} size='small' />
              </Tooltip>
            </div>

          </div>

        )}
      />
    </div>

  )
}


export default function Trainings() {
  return (
    <div className='flex flex-col gap-4'>
      <RequestTraining />
      <Training />
    </div>
  )
}