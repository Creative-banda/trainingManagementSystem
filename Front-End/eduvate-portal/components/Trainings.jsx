import React, { useContext, useState } from 'react'
import { Button, Table, Select, Tooltip, Popover, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import useUserOptions from '../hooks/fetch_user';
import { ModalContext } from '../context/modal_context';
import EditModal from '../modals/edit';
import AddTrainingModal from '../modals/add_training';
import { useTrainings } from '../hooks/fetch_training';
import useSchools from '../hooks/fetch_schools';
import RequestTraining from './RequestTraining';


function Training() {
  const [trainingData, setTrainingData] = useState({})
  const { setEditModal, setTrainingModal } = useContext(ModalContext);
  const { allSchoolOptions } = useSchools();
  const { userName } = useUserOptions();
  const { pagination, setPagination, trainingsData, loadingTraining, fetchTraining, deleteTraining } = useTrainings();

  const [filter, setFilter] = useState({
    schools: "", trainers: "", offset: 0, limit: 10
  })

  const handleFilter = () => {
    // console.log(filter);
    fetchTraining({ ...filter });
  }


  const columns = [
    {
      title: "Schools",
      dataIndex: "schools",
      key: "id",
      render: (_, { schools }) => (
        <div>
          {
            schools.map((school) => (
              <div key={school?.id}>
                {school?.name}
              </div>
            ))
          }
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "trainingStatus",
      key: "id",
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
      title: "Trainers",
      key: "id",
      dataIndex: "trainers",
      render: (_, { trainers }) => (
        <div className='flex flex-wrap gap-2 items-center justify-center'>
          {
            trainers?.map((user) => (
              <p key={user?.id} className=' bg-lime-300 rounded-lg px-2'> {user?.first_name} </p>
            ))
          }
        </div>
      ),

    },
    {
      title: "Training Type",
      key: "id",
      dataIndex: "trainingType",
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
      title: "Action",
      key: "id",
      render: (training) => (
        <div className='flex gap-2'>
          <Tooltip title="View Or Edit">
            <Button icon={<EyeOutlined />} size='small' onClick={() => {
              setTrainingData(training);
              setEditModal(true);
            }} />
          </Tooltip>

          <Popconfirm title="Are you sure?" onConfirm={() => deleteTraining(training.id)} >
            <Button danger icon={<DeleteOutlined />} size='small' />
          </Popconfirm>
        </div>
      )
    }

  ]


  const handleTableChange = (pagination) => {
    setPagination(pagination);
    setFilter({ ...filter, offset: (pagination?.current - 1) * pagination?.pageSize, limit: pagination?.pageSize });
  }

  return (
    <div className='flex flex-col gap-4'>
      <EditModal trainingData={trainingData} />
      <AddTrainingModal />

      <RequestTraining/>

      <Table columns={columns} dataSource={trainingsData} loading={loadingTraining} pagination={pagination} onChange={handleTableChange} size='small' className='border rounded-lg'
        // Title for filtering and other information
        title={() => (
          <div className='flex justify-between'>

            <div className='flex gap-2'>
              <Select placeholder="Search by Trainer" options={userName} onSelect={(value) => setFilter({ ...filter, trainers: value })} onClear={() => setFilter({ ...filter, trainers: "" })} allowClear showSearch optionFilterProp='label' size='small'
                optionRender={(user) => (
                  <div className='flex justify-between'>
                    <span>{user.data.label}</span>
                    <span className={`${user.data.desc < 4 ? "text-green-400" : "text-red-400"}`}>{user.data.desc}</span>
                  </div>
                )
                }
              />
              <Select placeholder="Search by School" allowClear showSearch optionFilterProp='label' options={allSchoolOptions} size='small'
                onSelect={(value) => setFilter({ ...filter, schools: value })} onClear={() => setFilter({ ...filter, schools: "" })}
              />

              <Button type='primary' icon={<SearchOutlined />} onClick={() => handleFilter()} size='small' />

            </div>

            <div className='flex gap-2'>
              <Tooltip title="Add New Training">
                <Button shape='round' icon={<PlusCircleOutlined />} onClick={() => setTrainingModal(true)} size='small'> ADD </Button>
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

export default Training