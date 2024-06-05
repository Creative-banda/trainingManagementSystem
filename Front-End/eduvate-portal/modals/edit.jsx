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
import useTrainingById, { useTrainings } from '../hooks/fetch_training';
import { SchoolCatagory, TrainingStatus, TrainingType } from '../utils/MenuItems';


const EditModal = ({ trainingData }) => {
    const { editModal, setEditModal } = useContext(ModalContext);
    const [isSubmitting, setSubmitting] = useState(false);  // To keep track of submittion loading
    // console.log(trainingData);

    const { userName } = useUserOptions();
    const { allSchoolOptions } = useSchools();
    const { updateTrainingMutate } = useTrainings();
    const { grades } = useGrades();
    const [form] = Form.useForm();

    const handleOk = async (values) => {
        setSubmitting(true);
        values["startDate"] = values.startDate.format("YYYY-MM-DD");
        values["startTime"] = values.startTime.format("HH:mm");
        values["endTime"] = values.endTime.format("HH:mm");

        values["currentGrade"] = Array.isArray(values.currentGrade) ? values.currentGrade[0].value : values.currentGrade;
        // console.log(values);

        if (typeof values["grades"][0] != typeof 1) {
            values["grades"] = values?.grades?.map(({ value }) => value)
        }

        if (typeof values["schools"][0] != typeof " ") {
            values['schools'] = values?.schools?.map(({ value }) => value)
        }

        if (typeof values["trainer"] != typeof " ") {
            values['trainer'] = values?.trainer.value
        }
        updateTrainingMutate({value: values, id: trainingData?.id});
        setEditModal(false);
    };

    // console.log(trainingData);

    const handleCancel = () => {
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
                                value: trainingData?.trainingDetail?.map(school => (
                                    { label: school?.school?.name, value: school?.school?.id }
                                ))
                            },
                            {
                                name: ["trainingStatus"],
                                value: trainingData?.trainingStatus
                            },
                            {
                                name: ["trainer"],
                                value: {
                                    label: trainingData?.trainer?.username,
                                    value: trainingData?.trainer?.id
                                }
                            },
                            {
                                name: ["grades"],
                                value: trainingData?.trainingDetail && trainingData?.trainingDetail[0].grades?.map(grade => (
                                    { label: grade.grades, value: grade.id }))
                            },
                            {
                                name: ["subject"],
                                value: trainingData?.trainingDetail && trainingData?.trainingDetail[0].subject
                            },
                            {
                                name: ["currentGrade"],
                                value: [
                                    {
                                        label: trainingData?.currentGradeDetails?.grades,
                                        value: trainingData?.currentGradeDetails?.id
                                    }
                                ]
                            },
                            {
                                name: ["startDate"],
                                value: trainingData?.trainingDetail && dayjs(trainingData?.trainingDetail[0].startDate, "YYYY-MM-DD")
                            },
                            {
                                name: ["startTime"],
                                value: trainingData?.trainingDetail && dayjs(trainingData?.trainingDetail[0].startTime, "HH:mm")
                            },
                            {
                                name: ["endTime"],
                                value: trainingData?.trainingDetail && dayjs(trainingData?.trainingDetail[0].endTime, "HH:mm")
                            }
                        ]}

                    >
                        <Form.Item label="Schools" name="schools" rules={[{ required: true, message: "Please select the school/s" }]}>
                            <Select
                                name="schools"
                                mode='multiple'
                                placeholder="Select Schools"

                            />
                        </Form.Item>


                        <div className='flex gap-2 w-full'>
                            <Form.Item label="Training Status" name="trainingStatus" rules={[{ required: true, message: "Please select the training type" }]} className='flex-1'>
                                <Select
                                    placeholder="Select a training status"
                                    options={TrainingStatus}
                                />
                            </Form.Item>

                            <Form.Item label="Running Grade" name="currentGrade" rules={[{ required: true, message: "Please select the running grade" }]}>
                                <Select
                                    placeholder="Update Grade"
                                    options={grades}
                                    allowClear
                                />
                            </Form.Item>
                        </div>

                        <Form.Item label="Trainer/s" name="trainer" rules={[{ required: true, message: "Please select the trainer/s" }]}>
                            <Select
                                placeholder="Please select"
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
                                options={grades}
                            />
                        </Form.Item>

                        <div className='flex gap-2'>

                            <Form.Item label="Training Type" name="subject" rules={[{ required: true, message: "Please select the Training Type" }]} className='w-full'>
                                <Select
                                    placeholder="Select training type"
                                    options={TrainingType}
                                />
                            </Form.Item>

                            <Form.Item label="Training Start Date" name="startDate" rules={[{ required: true, message: "Please select Start Date" }]} className='w-full'>
                                <DatePicker format="YYYY-MM-DD" className='w-full' />
                            </Form.Item>
                        </div>

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
                                <Button onClick={handleCancel}>Go Back</Button>
                            </Form.Item>

                            <Form.Item>
                                <Button danger htmlType='submit'>Save Edited</Button>
                            </Form.Item>
                        </div>

                    </Form>

                </div>
            </Modal>
        </>
    );
};
export default EditModal;