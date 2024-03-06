import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Input, Select, DatePicker, TimePicker, Form, message, Skeleton } from 'antd';
import { ModalContext } from '../context/modal_context';
import dayjs from 'dayjs';
import { TrainingStatus, TrainingType } from '../utilities/MenuItems';
import useGrades from '../hooks/fetch_grades';


export const UpdateTrainingModal = ({ data }) => {
    const [loading, setLoading] = useState(true);
    // console.log(data);
    const { updateTrainingModal, setUpdateTrainingModal } = useContext(ModalContext);
    const [form] = Form.useForm();
    const {grades, gradeLoading} = useGrades();
    

    const handleOk = async (values) => {
        values.schools = values.schools.map(school => school.value);
        values.grades = values.grades.map(grade => grade.value);
        values.currentGrade = typeof values.currentGrade === 'object' ? values.currentGrade.value : values.currentGrade;
        console.log(values);
    };

    const handleCancel = () => {
        setUpdateTrainingModal(false);
    };

    useEffect(() => {
        setLoading(false);
    }, [])

    return (
        <>
            <Modal title="Edit Training" open={updateTrainingModal} onCancel={handleCancel}
                footer={[]} centered
            >
                <div>
                    <Form
                        name='basic' layout='vertical' onFinish={handleOk} form={form}
                        fields={[
                            {
                                name: ["schools"],
                                value: data?.schools?.map(school => ({
                                    label: school.name,
                                    value: school.id
                                }))
                            },
                            {
                                name: ["trainingStatus"],
                                value: data?.trainingStatus
                            },
                            {
                                name: ["trainers"],
                                value: data?.trainers.map(trainer => ({
                                    label: trainer.username,
                                    value: trainer.id
                                }))
                            },
                            {
                                name: ["grades"],
                                value: data?.grades.map(grade => ({
                                    label: grade.grades,
                                    value: grade.id
                                }))
                            },
                            {
                                name: ["trainingType"],
                                value: data?.trainingType
                            },
                            {
                                name: ["currentGrade"],
                                value: {
                                    label: data?.currentGradeDetails.grades,
                                    value: data?.currentGradeDetails.id
                                }
                            },
                            {
                                name: ["startDate"],
                                value: dayjs(data?.startDate, "YYYY-MM-DD")
                            },
                            {
                                name: ["startTime"],
                                value: dayjs(data?.startTime, "HH:mm")
                            },
                            {
                                name: ["endTime"],
                                value: dayjs(data?.endTime, "HH:mm")
                            }
                        ]}

                    >


                        <Skeleton loading={loading}>

                            <Form.Item label="School" name="schools" rules={[{ required: true, message: "Please select the school" }]}>
                                <Select placeholder="Select school"
                                    mode='multiple'
                                    disabled />
                            </Form.Item>

                            <div className='flex gap-2 w-full'>
                                <Form.Item label="Training Status" name="trainingStatus" rules={[{ required: true, message: "Please select the training type" }]} className='flex-1'>
                                    <Select
                                        placeholder="Select a training status"
                                        // defaultValue={data?.trainingStatus}
                                        options={TrainingStatus}
                                    />
                                </Form.Item>

                                <Form.Item label="Running Grade" name="currentGrade" rules={[{ required: true, message: "Please select the running grade" }]}>
                                    <Select
                                        placeholder="Update Grade"
                                        options={grades}
                                        loading={gradeLoading}
                                        allowClear
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item label="Grades" name="grades" rules={[{ required: true, message: "Please select the grade/s" }]}>
                                <Select
                                    mode='multiple'
                                    placeholder="Select Grades"
                                    disabled
                                />
                            </Form.Item>

                            <Form.Item label="Training Type" name="trainingType" rules={[{ required: true, message: "Please select the Training Type" }]}>
                                <Select
                                    placeholder="Select training type"
                                    disabled
                                />
                            </Form.Item>

                            <div className='flex gap-2 justify-end items-center'>
                                <Form.Item>
                                    <Button onClick={handleCancel}>Go Back</Button>
                                </Form.Item>

                                <Form.Item>
                                    <Button danger htmlType='submit' loading={false}>Save Edited</Button>
                                </Form.Item>
                            </div>
                        </Skeleton>

                    </Form>

                </div>
            </Modal>
        </>
    );
};