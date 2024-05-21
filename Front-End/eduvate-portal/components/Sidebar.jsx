import LinkComponent from './LinkComponent';
import { PoweroffOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import SubMenu from 'antd/es/menu/SubMenu';
import { Button } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarLinks } from '../utils/Links';
import useLogout from '../hooks/logout_user';


function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const Sidebar = () => {
    const { handleLogout, loading } = useLogout()

    return (
        <div className='h-full w-full flex items-center flex-col gap-8 px-2 py-2'>
            {/* Logo Section  */}
            <img src='/images/logo.jpg' className='rounded-full w-24 h-24' />

            {/* Menu Section */}
            <div className='h-full'>
                <Menu
                    defaultSelectedKeys={['1']}
                    mode="vertical"
                    className=' bg-inherit'
                    style={{border:"none"}}
                >
                    {SidebarLinks?.map(item => {
                        if (item?.children) {
                            return (
                                <SubMenu key={item?.key} icon={item?.icon} title={item?.label}>
                                    {item?.children.map(child => (
                                        <Menu.Item key={child.key} icon={child.icon}>
                                            <Link to={child.path}>{child.label}</Link>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            );
                        }
                        return (
                            <Menu.Item key={item?.key} icon={item?.icon}>
                                <Link to={item?.path}>{item?.label}</Link>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </div>

            {/* Logout Section */}
            <div className='w-full h-full flex justify-center items-end p-4'>
                <Button className='bg-red-400 text-white' icon={<PoweroffOutlined />} onClick={() => handleLogout()} loading={loading} />
            </div>

        </div>
    );
};
export default Sidebar;