import React, { useEffect, useState, useRef } from 'react'
import { Space, Table, Tag, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';


function Schools() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState([])

  // Search functionality for table colums and data
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "ERP Code",
      dataIndex: "erp_code",
      width: 100,
      key: "erp_code",
      fixed: 'left',
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps('name'),
    },
    {
      title: "Grades",
      key: "grades",
      dataIndex: "grades",
      render: (_, { grades }) => (
        <>
          {
            grades.map((grade) => {
              return (
                <Tag key={grade} className='bg-cyan-700 text-white'>
                  {grade}
                </Tag>
              )
            })
          }
        </>
      ),
    },
    {
      title: 'Training Status',
      dataIndex: 'training_status',
      key: 'training_status',

      render: (_, { training_status }) => (
        <Tag className={`${training_status == 'PENDING' ? 'bg-red-500 text-white' : training_status == 'ONGOING' ? "bg-yellow-400 text-black" : training_status == 'COMPLETED' ? 'bg-green-400 text-white' : ''}`}>
          {training_status}
        </Tag>
      ),

      filters: [
        {
          text: 'Pending',
          value: "PENDING"
        },
        {
          text: 'Completed',
          value: "COMPLETED"
        },
        {
          text: 'On Going',
          value: "ONGOING",
        }

      ],
      onFilter: (value, record) => record.training_status.indexOf(value) === 0,
    },

    {
      title: "Academic Manager",
      dataIndex: "am",
      key: "am",
      render: (_, { am }) => (
        <>
          <p>{am.username}</p>
        </>
      )
    },
    {
      title: "Operational Manager",
      dataIndex: "om",
      key: "om",
      render: (_, { om }) => (
        <>
          <p>{om.username}</p>
        </>
      )
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, action) => (
        <Space>
          <Tag className='bg-red-500 text-white'>Delete</Tag>
          <Tag className='bg-green-500 text-white'>Update</Tag>
        </Space>
      ),
      fixed: 'right'
    }

  ]



  // Fetching school data from django server
  useEffect(() => {
    setLoading(true);
    (async () => {
      axios.get(`${BASE_URL}/school/schools`)
        .then((response) => {
          setLoading(false);
          setSchools(response.data);
        })
        .catch((error) => {
          console.log(error.error_message);
          setLoading(false)
        })
    })()
  }, [])

  return (
    <div className='w-full h-full'>
      <Table columns={columns} dataSource={schools} pagination={{ pageSize: 50 }} scroll={{ x: 1000, y: 300 }} loading={loading} />

    </div>
  )
}

export default Schools