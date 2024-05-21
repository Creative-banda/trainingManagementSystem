import LinkComponent from './LinkComponent';
import { Links } from '../../utilities/MenuItems';
import { useEffect, useState } from 'react';
import { useUserInfo } from '../../hooks/token_hooks';
import { LuFileSpreadsheet, LuSchool } from 'react-icons/lu';
import SubMenu from 'antd/es/menu/SubMenu';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';


const Sidebar = () => {
    const [links, setLinks] = useState(Links());
    const [collapsed, setCollapsed] = useState(false);
    const { is_am_om } = useUserInfo()

    const sheet_menu = [
        {
            key: 3,
            label: "Sheets",
            path: "/sheets",
            icon: <LuFileSpreadsheet />
        },
        {
            key: 4,
            label: "Schools",
            path: "/schools",
            icon: <LuSchool />
        }
    ]

    useEffect(() => {
        is_am_om && setLinks([...links, ...sheet_menu])
    }, [])

    return (
        <div className='h-full w-full flex items-center flex-col gap-8'>
            {/* Logo Section  */}
            <img src='/images/logo.jpg' className='rounded-full w-24 h-24' />

            {/* Menu Section */}
            <div className=''>
                <Menu
                    defaultSelectedKeys={['1']}
                    // defaultOpenKeys={['sub1']}
                    mode="inline"
                    style={{background:"transparent", border:"none"}}
                    inlineCollapsed={collapsed}
                >
                    {links?.map(item => {
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

        </div>
    );
};
export default Sidebar;