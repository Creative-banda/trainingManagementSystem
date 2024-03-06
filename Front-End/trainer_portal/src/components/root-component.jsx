import React, { useContext, useEffect } from 'react'
import Sidebar from './Sidebar'
import {TodaysTrainings} from './Statistics/Statistics'
import { Outlet, useNavigate } from 'react-router-dom'
import { Context } from '../../context/user_context'

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
            <div className='absolute top-0 w-40 left-0 h-screen border px-2'>
                <Sidebar />
            </div>

            {/* Right Content */}
            <div className=' ml-44 flex flex-col h-full w-full gap-2'>
                {/* Header Section */}
                <div className=' h-32 w-full'>
                    <TodaysTrainings />
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