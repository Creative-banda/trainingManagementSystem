import React, { useContext, useEffect } from 'react'
import Sidebar from './Sidebar'
import {TodaysTrainings} from './Statistics/Statistics'
import { Outlet, useNavigate } from 'react-router-dom'
import { Context } from '../../context/user_context'
import { Avatar, Button, Dropdown } from 'antd'
import { useUserInfo } from '../../hooks/token_hooks'
import useLogout from '../../hooks/logout_user'

function RootComponent() {
    const {isAuthenticated} = useContext(Context);
    const redirect = useNavigate();

    useEffect(() => {
        if(!isAuthenticated){
            redirect("/login");
        }
    }, [isAuthenticated])
    
    return (
        // Main Division
        <div className='relative w-full h-full flex gap-2'>
            {/* Menu Section */}
            <div className='fixed top-0 left-0 h-screen px-2 py-2 bg-sky-600'>
                <Sidebar />
            </div>

            {/* Right Content */}
            <div className='ml-44 flex flex-col h-full w-full gap-2'>
                {/* Header Section */}
                <div className='h-32 w-full flex items-center pr-4'>
                    <TodaysTrainings />
                    <UserDropDown/>
                </div>

                {/* Body Section */}
                <div className='h-full w-full'>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default RootComponent


export const UserDropDown = () => {
    const {userInfo} = useUserInfo();
    const redirect = useNavigate();
    const {handleLogout} = useLogout();
    const items = [
        {
          key: '1',
          label: (
            <div role='button' className='w-full' onClick={() => redirect("/profile")}> Profile </div>
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