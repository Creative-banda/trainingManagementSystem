import { Button, Input } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import api from "../../utilities/axios_interceptor"
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/user_context';

function Login() {
    const [authInfo, setAuthInfo] = useState({email:"", password:""})
    const redirect = useNavigate();
    const {setIsAuthenticated, isAuthenticated} = useContext(Context);

    const handleUserInfo = (e) => {
        setAuthInfo({
            ...authInfo,
            [e.target.name]:e.target.value
        })
    }

    const fetchUserInfo = async (access) => {
        await api({
            method: 'GET',
            url:"/account/auth",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + access
            }
        }).then(response => {
            setIsAuthenticated(true);
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            redirect("/");
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        })
    }


    /**
     * Function to handle the login process.
     *
     * @return {Promise<void>} This function returns a promise with no specific value.
     */
    const handleLogin = async () => {
        await api({
            method: 'POST',
            url:"/token/",
            data: JSON.stringify(authInfo),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((response) => {
            localStorage.setItem("access_token", response?.data?.access);
            localStorage.setItem("refresh_token", response?.data?.refresh);
            fetchUserInfo(response?.data?.access);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        if(isAuthenticated){
            redirect("/");
        }
    }, [isAuthenticated]);


    return (
        <div className='w-screen h-screen flex gap-2'>
            
            <div className='flex-1'>
                <div className='flex justify-center items-center w-full h-full'>
                    <div className='shadow-md p-8 rounded-lg flex flex-col justify-center items-center'>

                        <div className=' w-28 h-28 rounded-full'>
                            <img src='/images/logo.jpg' className='select-none pointer-events-none border w-28'/>
                        </div>

                        <h1 className='text-2xl font-bold text-gray-700 mb-4 select-none'> Hello there 👋 </h1>

                        <form className='flex flex-col gap-4'>
                            <div>
                                <label htmlFor='email' className=' text-slate-500'>Username</label>
                                <Input type='email' name="email" id="email" placeholder='Email' prefix={<MailOutlined className='text-md mr-2' />} onChange={handleUserInfo} autoComplete='email' required/>
                            </div>

                            <div>
                                <label htmlFor='password' className=' text-slate-500'>Password</label>
                                <Input.Password id="password" name='password' placeholder='Password' 
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                                prefix={<SafetyOutlined className='text-md mr-2'/>}
                                onChange={handleUserInfo} required autoComplete='current-password'
                                />
                            </div>

                            <Button className=' bg-blue-700 text-white' onClick={() => handleLogin()}> Login </Button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login