import React from 'react';
import { Button, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
const PageNotFound = () => {
    const redirect = useNavigate();
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <Empty
                image="https://www.sunflowerhospital.in/assets/img/bg/404-error-dribbble-800x600.gif"
                imageStyle={{ width: 400, height: 300 }}
                // className='w-40 h-40'
                description={<Button onClick={() => redirect("/")} >Back Home</Button>}
            />
        </div>
    );
}
export default PageNotFound;