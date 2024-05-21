import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { Link } from 'react-router-dom';
import SubMenu from 'antd/es/menu/SubMenu';
import { icons } from 'antd/es/image/PreviewGroup';

const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: 'Option 1',
    path: "/option1"
  },
  {
    key: '2',
    icon: <DesktopOutlined />,
    label: 'Option 2',
    path: "/option2"
  },
  {
    key: '3',
    icon: <ContainerOutlined />,
    label: 'Option 3',
    path: "/option3"
  },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <MailOutlined />,
    children: [
      {
        key: '5',
        label: 'Option 5',
        path: "/option5",
        icon: <MailOutlined />,
      },
      {
        key: '6',
        label: 'Option 6',
        path: "/option6"
      },
      {
        key: '7',
        label: 'Option 7',
        path: "/option7"
      },
      {
        key: '8',
        label: 'Option 8',
        path: "/option8"
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '9',
        label: 'Option 9',
        path: "/option9"
      },
      {
        key: '10',
        label: 'Option 10',
        path: "/option10"
      },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          {
            key: '11',
            label: 'Option 11',
            path: "/option11"
          },
          {
            key: '12',
            label: 'Option 12',
            path: "/option12"
          },
        ],
      },
    ],
  },
];
const Testing_Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div
      style={{
        width: 256,
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
        >
          {items.map(item => {
            if (item.children) {
              return (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map(child => (
                    <Menu.Item key={child.key} icon={child.icon}>
                      <Link to={child.path}>{child.label}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
    </div>
  );
};
export default Testing_Sidebar;