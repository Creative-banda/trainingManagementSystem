import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/user_context';
import { HeaderStatistics } from './Statistics';
import Sidebar from './Sidebar';
import { useUserInfo } from '../hooks/token_hooks';
import useLogout from '../hooks/logout_user';
import { Avatar, Button, Dropdown } from 'antd';


const RootComponent = () => {
    const { isAuthenticated } = useContext(Context);
    const redirect = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            redirect("/login");
        }
    }, [isAuthenticated])

    return (
        <div className='flex gap-2'>
            {/* Menu Section */}
            <div className='h-screen fixed top-0 left-0 bottom-0 bg-white border'>
                <Sidebar />
            </div>

            {/* Right Content */}
            <div className='sm:ml-40 ml-20 flex flex-col w-full gap-2 p-2'>

                {/* Header Section */}
                <div className='flex justify-around items-center gap-4 h-32 w-full drop-shadow-lg'>
                    <HeaderStatistics/>
                    <UserDropDown/>
                </div>

                {/* Body Section */}
                <div className='w-full'>
                    <Outlet />

                </div>

            </div>
        </div>
    )
};
export default React.memo(RootComponent);

export const UserDropDown = () => {
    const {userInfo} = useUserInfo();
    const redirect = useNavigate();
    const {handleLogout} = useLogout();
    const items = [
        {
          key: '1',
          label: (
            <div role='button' className='w-full' onClick={() => redirect('/profile')} > Profile </div>
          ),
        },
        {
          key: '2',
          label: (
            <Button danger className='w-full' onClick={handleLogout} >Logout</Button>
          ),
        },
      ];

    return (
        <Dropdown menu={{ items }} trigger={['click']} arrow>
            <Avatar size="large" shape='square' className='cursor-pointer bg-teal-300 focus:shadow-md focus:border-2' > {userInfo?.first_name} </Avatar>
        </Dropdown>
    )
}