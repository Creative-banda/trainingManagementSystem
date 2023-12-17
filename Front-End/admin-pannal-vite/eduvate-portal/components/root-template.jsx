import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined, DashboardOutlined, TeamOutlined, TableOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';

import { Layout, Menu, Button, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;

const RootComponent = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout className='h-full' hasSider>
            <Sider trigger={null} collapsible collapsed={collapsed}
                breakpoint='md'
                onBreakpoint={(breakpoint) => breakpoint ? setCollapsed(true) : setCollapsed(false)}
                style={{ overflow: 'auto', height: '100vh' }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    // defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                            onClick: () => { navigate('/dashboard') }

                        },
                        {
                            key: '2',
                            icon: <TeamOutlined />,
                            label: 'Schools',
                            onClick: () => { navigate('/schools') }
                        },
                        {
                            key: '3',
                            icon: <TableOutlined />,
                            label: 'Training',
                            onClick : () => { navigate('/training') }
                        },
                    ]}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{padding: 0, background: colorBgContainer}}>
                    <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64, }} />
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, overflowY : 'scroll' }}>


                    <Outlet />


                </Content>
            </Layout>
        </Layout>
    );
};
export default React.memo(RootComponent);