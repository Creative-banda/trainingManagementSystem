import { Button, Form, Image, Input, Tooltip, Upload, message } from 'antd'
import React, { useState } from 'react'
import { useToken, useUserInfo } from '../hooks/token_hooks'
import { UploadOutlined } from '@ant-design/icons'
import api from '../interceptor/axios_interceptor'
import { useNavigate } from 'react-router-dom'
import useLogout from '../hooks/logout_user'

const BASE_URL = import.meta.env.VITE_BASE_URL

function Profile() {
    const { userInfo } = useUserInfo()
    const [imageUrl, setImageUrl] = useState(userInfo?.profilePic);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [form] = Form.useForm()
    const { access_token } = useToken();
    const {handleLogout} = useLogout();

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('profilePic', file);
        })
        setLoading(true);
        await api({
            method: 'PUT',
            url: '/account/auth/',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(res => {
            if (res.status === 200) {
                setImageUrl(res.data.profilePic);
                setFileList([]);
                // update the profilePic key of userInfo in the localstorage
                const updatedUserInfo = { ...userInfo, profilePic: res.data.profilePic };
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                message.success('Profile Updated Successfully')
            }
            if (res.status === 400) {
                message.error('File size should be less than 2MB');
            }
            // console.log(res.data);
        }).catch(err => {
            console.log(err);
            message.error(err?.response?.data ? err?.response?.data : "Something went wrong");
        }).finally(() => {
            setLoading(false);
        })
    }

    const updatePassword = async (values) => {

        // Check the new password and confirm password match or not if not match then return error
        if (values.new_password !== values.confirm_password) {
            message.error('New Password and Confirm Password does not match');
            return
        }
        setLoading(true);
        await api({
            method: 'PUT',
            url: '/account/change-password/',
            data: values,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(res => {
            if (res.status === 200) {
                message.success('Password Updated Successfully').then(() => {
                    handleLogout();
                });
                // handleLogout();
            }else{
                const error = JSON.stringify(res.response.data);
                message.error(error);
            }
        }).catch(err => {
            console.log(err);
            message.error(err?.response?.data ? JSON.stringify(err?.response?.data) : "Something went wrong");
        }).finally(() => {
            setLoading(false);
        })
    }

    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileLis = fileList.slice();
            newFileLis.splice(index, 1);
            setFileList(newFileLis);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    }

    return (
        <div className='flex gap-4 justify-start flex-wrap'>
            <div className='flex h-fit flex-col gap-2 items-center border p-4 shadow-md rounded-md'>
                <Image
                    width={200}
                    className='rounded-full'
                    src={`${BASE_URL}${imageUrl}`}
                    placeholder={
                        <Image
                            preview={false}
                            src={`${BASE_URL}${imageUrl}`}
                            width={200}
                        />
                    }
                    fallback='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                />
                <p className='font-bold text-2xl'>{userInfo?.username}</p>
                <p className=' font-mono italic'>{userInfo?.email}</p>
                <div className='flex gap-2 text-green-500 font-medium'>
                    {
                        userInfo?.role?.map(role => <p key={role.role}>{role.role}</p>)
                    }
                </div>

                <div className='flex gap-2'>
                    <Upload {...props}>
                        <Tooltip title="Upload Profile Picture">
                            <Button icon={<UploadOutlined />} />
                        </Tooltip>
                    </Upload>

                    <Button type='primary' onClick={handleUpload} loading={loading} disabled={fileList.length === 0 || fileList.length > 1 || loading} >Update Profile</Button>
                </div>
            </div>

            <div className='border p-4 w-72 rounded-md shadow-md'>
                <p className='text-center font-bold text-xl mb-4'>Change Password</p>
                <Form layout="vertical" form={form} onFinish={updatePassword}>
                    <Form.Item name="old_password" label="Old Password" required rules={[{ required: true, message: 'Please input your old password!' }]} >
                        <Input.Password placeholder='Old Password' />
                    </Form.Item>

                    <Form.Item name="new_password" label="New Password" required rules={[{ required: true, message: 'Please input your new password!' }]} >
                        <Input.Password placeholder='New Password' />
                    </Form.Item>

                    <Form.Item name="confirm_password" label="Confirm Password" required rules={[{ required: true, message: 'Please input your confirm password!' }]} >
                        <Input.Password placeholder='Confirm Password' />
                    </Form.Item>

                    <Form.Item className='w-full'>
                        <Button loading={loading} className='w-full ring-2 ring-green-400 hover:ring-green-500' htmlType="submit">Update</Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    )
}

export default Profile