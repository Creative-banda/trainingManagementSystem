import React, { useContext, useState } from 'react'
import { Button, Table, Select, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
// import useUserOptions from '../hooks/fetch_user';
// import ConfirmModal from '../modals/confirm';
// import { ModalContext } from '../context/modal_context';
// import EditModal from '../modals/edit';
// import AddTrainingModal from '../modals/add_training';
import { useTrainings } from '../../hooks/fetch_training';
// import useFilterTraining from '../hooks/filter_training';


function Training() {
  const [trainingId, setTrainingId] = useState()
  // const { setConfirmModal, setEditModal, setTrainingModal } = useContext(ModalContext);
  // const { userName } = useUserOptions();
  const { pagination, setPagination, trainingsData, loadingTraining, fetchTraining } = useTrainings();


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
      render: ({ id }) => (
        <div className='flex gap-2'>
          <Tooltip title="View Or Edit">
            <Button icon={<EyeOutlined />} onClick={() => {
              setTrainingId(id);
              setEditModal(true);
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
      <Table columns={columns} dataSource={trainingsData} loading={loadingTraining} pagination={pagination} scroll={{ y: 340 }} onChange={handleTableChange} size='small'

        // Title for filtering and other information
        title={() => (
          <div className='flex justify-between'>

            <div className='flex gap-4'>
              <Tooltip title="Refresh Data">
                <Button icon={<ReloadOutlined />} onClick={() => fetchTraining({ limit: pagination.pageSize, offset: (pagination.current - 1) * pagination.pageSize })} />
              </Tooltip>
            </div>
          </div>

        )}
      />
    </div>
  )
}

export default Training