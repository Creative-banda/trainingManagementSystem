import LinkComponent from './LinkComponent';
import { PoweroffOutlined } from '@ant-design/icons';
import { Button } from 'antd';
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
            <div className='flex flex-col w-full gap-4 items-center justify-center'>
                {
                    SidebarLinks.map((menu) => (
                        <LinkComponent key={menu.id} label={menu.label} link={menu.link} icon={menu.icon} />
                    ))
                }
            </div>

            {/* Logout Section */}
            <div className='w-full h-full flex justify-center items-end p-4'>
                <Button type='primary' danger icon={<PoweroffOutlined />} onClick={() => handleLogout()} loading={loading} />
            </div>

        </div>
    );
};
export default Sidebar;