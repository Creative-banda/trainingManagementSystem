'use client'
import React, { useState } from 'react';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
const { Header, Content, Sider } = Layout;

const items = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
}));

const HomeLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <Layout hasSider className='h-screen w-screen gap-4'>
            <Sider trigger={null} collapsible collapsed={collapsed} theme='dark'
                breakpoint="lg"
                onBreakpoint={(broken) => {
                    setCollapsed(!collapsed);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="w-full sm:p-8 text-center text-3xl">
                    {collapsed ? "":'Eduvate'}
                </div>
                <Menu mode="inline" defaultSelectedKeys={['4']} items={items} theme='dark' />
            </Sider>
            <Layout className='gap-4'>
                <Header>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className='text-white border-white ml-0'
                    />
                </Header>

                <Content className="p-4 border">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default HomeLayout;