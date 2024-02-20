import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Input, Select, DatePicker, TimePicker, Form, message, Skeleton } from 'antd';
import { ModalContext } from '../context/modal_context';
import api from '../interceptor/axios_interceptor';
import { useToken } from '../hooks/token_hooks';
import { LoadingOutlined, ShopOutlined } from '@ant-design/icons';
import useSchools from '../hooks/fetch_schools';
import useUserOptions from '../hooks/fetch_user';
import useGrades from '../hooks/fetch_grades';
import dayjs from 'dayjs';
import useTrainingById from '../hooks/fetch_training';
import { SchoolCatagory, TrainingStatus, TrainingType } from '../utils/MenuItems';


const EditModal = ({ id }) => {
    const { editModal, setEditModal } = useContext(ModalContext);
    const [isSubmitting, setSubmitting] = useState(false);  // To keep track of submittion loading
    const [trainingById, setTrainingById] = useState({})    // Training fetching by id
    const { trainings, fetchingTraining, defaultValues, setDefaultValues } = useTrainingById(id, editModal);
    // console.log(defaultValues.currentGrade);


    const { userName } = useUserOptions();
    const { access_token } = useToken();
    const { schoolOptions } = useSchools();
    const { grades } = useGrades();
    const [form] = Form.useForm();

    const handleOk = async (values) => {
        setSubmitting(true);
        values["startDate"] = values.startDate.format("YYYY-MM-DD");
        values["startTime"] = values.startTime.format("HH:MM");
        values["endTime"] = values.endTime.format("HH:MM");
        
        values["currentGrade"] = typeof values.currentGrade === "object" ? values.currentGrade.value : values.currentGrade;
        // console.log(values);

        if (typeof values["grades"][0] != typeof 1) {
            values["grades"] = values?.grades?.map(({ value }) => {
                return value
            })
        }

        if (typeof values["schools"][0] != typeof " ") {
            values['schools'] = values?.schools?.map(({ value }) => {
                return value
            })
        }

        if (typeof values["trainers"][0] != typeof " ") {
            values['trainers'] = values?.trainers?.map(({ value }) => {
                return value
            })
        }

        console.log(values);
        await api({
            method: 'PUT',
            url: `/training/${id}/`,
            data: values,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then((response) => {
            if (response.data){
                console.log(response);
                message.success("Training Edited Successfully");
                setSubmitting(false);
                setEditModal(false);
            }else{
                message.error(response.message);
                setSubmitting(false);
            }
        }).catch((err) => {
            console.log(err?.response?.data);
            setSubmitting(false)
        })
        console.log(values);
    };

    const handleCancel = () => {

        setDefaultValues({
            defaultGrades: [],
            defaultSchools: [],
            defaultTrainers: [],
            currentGrade: {}
        });
        setTrainingById({});
        setEditModal(false);
    };


    return (
        <>
            <Modal title="Edit Training" open={editModal} onCancel={handleCancel}
                footer={[]} centered
            >
                <div>
                    <Form
                        name='basic' layout='vertical' onFinish={handleOk} form={form}
                        fields={[
                            {
                                name: ["schools"],
                                value: defaultValues?.defaultSchools
                            },
                            {
                                name: ["trainingStatus"],
                                value: trainings?.trainingStatus
                            },
                            {
                                name: ["trainers"],
                                value: defaultValues?.defaultTrainers
                            },
                            {
                                name: ["grades"],
                                value: defaultValues?.defaultGrades
                            },
                            {
                                name: ["trainingType"],
                                value: trainings?.trainingType
                            },
                            {
                                name: ["currentGrade"],
                                value: defaultValues?.currentGrade
                            },
                            {
                                name: ["startDate"],
                                value: dayjs(trainings?.startDate, "YYYY-MM-DD")
                            },
                            {
                                name: ["startTime"],
                                value: dayjs(trainings?.startTime, "HH:mm")
                            },
                            {
                                name: ["endTime"],
                                value: dayjs(trainings?.endTime, "HH:mm")
                            }
                        ]}

                    >


                        <Skeleton loading={fetchingTraining}>
                            <Form.Item label="Schools" name="schools" rules={[{ required: true, message: "Please select the school/s" }]}>
                                <Select
                                    name="schools"
                                    mode='multiple'
                                    placeholder="Select Schools"
                                    defaultValue={defaultValues?.defaultSchools}
                                    options={schoolOptions}
                                    onChange={(value) => console.log(value)}

                                />
                            </Form.Item>


                            <div className='flex gap-2 w-full'>
                                <Form.Item label="Training Status" name="trainingStatus" rules={[{ required: true, message: "Please select the training type" }]} className='flex-1'>
                                    <Select
                                        placeholder="Select a training status"
                                        defaultValue={trainings?.trainingStatus}
                                        options={TrainingStatus}
                                    />
                                </Form.Item>

                                <Form.Item label="Running Grade" name="currentGrade" rules={[{ required: true, message: "Please select the running grade" }]}>
                                    <Select
                                        placeholder="Update Grade"
                                        defaultValue={defaultValues.currentGrade}
                                        options={grades}
                                        allowClear
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item label="Trainer/s" name="trainers" rules={[{ required: true, message: "Please select the trainer/s" }]}>
                                <Select
                                    mode="multiple"
                                    placeholder="Please select"
                                    defaultValue={defaultValues?.defaultTrainers}
                                    options={userName}
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
                                    defaultValue={defaultValues?.defaultGrades}
                                    options={grades}
                                />
                            </Form.Item>

                            <Form.Item label="Training Type" name="trainingType" rules={[{ required: true, message: "Please select the Training Type" }]}>
                                <Select
                                    placeholder="Select training type"
                                    defaultValue={trainings?.trainingType}
                                    options={TrainingType}
                                />
                            </Form.Item>

                            <Form.Item label="Training Start Date" name="startDate" rules={[{ required: true, message: "Please select Start Date" }]}>
                                <DatePicker defaultValue={dayjs(trainings?.startDate)} format="YYYY-MM-DD" className='w-full' />
                            </Form.Item>

                            <div className='flex gap-2'>
                                <Form.Item label="Start Time" name="startTime" rules={[{ required: true, message: "Please select the start time" }]} className='flex-1'>
                                    <TimePicker format="HH:mm" defaultValue={dayjs(trainingById?.startTime, 'HH:mm')} className='w-full' />
                                </Form.Item>

                                <Form.Item label="End Time" name="endTime" rules={[{ required: true, message: "Please select the End Time" }]} className='flex-1'>
                                    <TimePicker format="HH:mm" defaultValue={dayjs(trainings?.endTime, 'HH:mm')} className='w-full' />
                                </Form.Item>
                            </div>

                            <div className='flex gap-2 justify-end items-center'>
                                <Form.Item>
                                    <Button onClick={handleCancel}>Go Back</Button>
                                </Form.Item>

                                <Form.Item>
                                    <Button danger htmlType='submit' loading={isSubmitting}>Save Edited</Button>
                                </Form.Item>
                            </div>
                        </Skeleton>

                    </Form>

                </div>
            </Modal>
        </>
    );
};
export default EditModal;