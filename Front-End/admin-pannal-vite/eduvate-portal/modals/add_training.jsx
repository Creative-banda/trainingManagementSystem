import React, { useContext, useState } from 'react';
import { Button, Modal, Select, DatePicker, TimePicker, Form, message } from 'antd';
import { ModalContext } from '../context/modal_context';
import api from '../interceptor/axios_interceptor';
import { useToken } from '../hooks/token_hooks';
import { SendOutlined } from '@ant-design/icons';
import useSchools from '../hooks/fetch_schools';
import useUserOptions from '../hooks/fetch_user';
import useGrades from '../hooks/fetch_grades';
import { TrainingType } from '../utils/MenuItems';
import { useTrainings } from '../hooks/fetch_training';


const AddTrainingModal = ({ id }) => {
    const { addTrainingModal, setTrainingModal } = useContext(ModalContext);


    const { userName } = useUserOptions();
    // const { access_token } = useToken();
    const {addTraining, loadingTraining} = useTrainings();
    const { schoolOptions } = useSchools();
    const { grades } = useGrades();
    const [form] = Form.useForm();

    // console.log(defaultTrainers, defaultGrades);
    // console.log(trainingById)

    const handleOk = async (values) => {
        values["startDate"] = values.startDate.format("YYYY-MM-DD");
        values["startTime"] = values.startTime.format("HH:MM");
        values["endTime"] = values.endTime.format("HH:MM");
        values["currentGrade"] = values.grades[0]
        console.log(values);

        addTraining(values)

    };

    const handleCancel = () => {
        form.resetFields();
        setTrainingModal(false);
    };

    return (
        <>
            <Modal title="Edit Training" open={addTrainingModal} onOk={handleOk} onCancel={handleCancel}
                footer={[]} centered
            >
                <div>
                    <Form
                        name='basic' layout='vertical' onFinish={handleOk} form={form}
                    >
                        <Form.Item label="Schools" name="schools" rules={[{ required: true, message: "Please select the school/s" }]}>
                            <Select
                                name="schools"
                                mode='multiple'
                                placeholder="Select Schools"
                                options={schoolOptions}
                                optionFilterProp='label'
                            />
                        </Form.Item>

                        <Form.Item label="Trainer/s" name="trainers" rules={[{ required: true, message: "Please select the trainer/s" }]}>
                            <Select
                                mode='multiple'
                                placeholder="Please select"
                                options={userName}
                                optionFilterProp='label'
                                optionRender={(user) => (
                                    <div className='flex justify-between'>
                                        <span>{user.data.label}</span>
                                        <span className={`${user.data.desc < 4 ? "text-green-400" : "text-red-400"}`}>{user.data.desc}</span>
                                    </div>
                                )
                                }
                            />
                        </Form.Item>

                        <Form.Item label="Grades" name="grades" rules={[{ required: true, message: "Please select the grade/s" }]}>
                            <Select
                                mode='multiple'
                                placeholder="Select Grades"
                                options={grades}
                                optionFilterProp='label'
                            />
                        </Form.Item>

                        <Form.Item label="Training Type" name="trainingType" rules={[{ required: true, message: "Please select the Training Type" }]}>
                            <Select
                                placeholder="Select training type"
                                optionFilterProp='label'
                                showSearch
                                options={TrainingType}
                            />
                        </Form.Item>

                        <Form.Item label="Training Start Date" name="startDate" rules={[{ required: true, message: "Please select Start Date" }]}>
                            <DatePicker format="YYYY-MM-DD" className='w-full' />
                        </Form.Item>

                        <div className='flex gap-2'>
                            <Form.Item label="Start Time" name="startTime" rules={[{ required: true, message: "Please select the start time" }]} className='flex-1'>
                                <TimePicker format="HH:mm" className='w-full' />
                            </Form.Item>

                            <Form.Item label="End Time" name="endTime" rules={[{ required: true, message: "Please select the End Time" }]} className='flex-1'>
                                <TimePicker format="HH:mm" className='w-full' />
                            </Form.Item>
                        </div>

                        <div className='flex gap-2 justify-end items-center'>
                            <Form.Item>
                                <Button type='primary' onClick={handleCancel}>Go Back</Button>
                            </Form.Item>

                            <Form.Item>
                                <Button danger htmlType='submit' icon={<SendOutlined />} loading={loadingTraining}>Submit</Button>
                            </Form.Item>
                        </div>

                    </Form>

                </div>
            </Modal>
        </>
    );
};
export default AddTrainingModal;