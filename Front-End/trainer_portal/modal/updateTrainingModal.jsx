import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Input, Select, DatePicker, TimePicker, Form, message, Skeleton } from 'antd';
import { ModalContext } from '../context/modal_context';
import dayjs from 'dayjs';
import { TrainingStatus, TrainingType } from '../utilities/MenuItems';
import useGrades from '../hooks/fetch_grades';
import { useTraining } from '../hooks/training_hook'


export const UpdateTrainingModal = ({ data }) => {
    const { updateTrainingMutate } = useTraining()
    const { updateTrainingModal, setUpdateTrainingModal } = useContext(ModalContext);
    const [form] = Form.useForm();
    const { grades, gradeLoading } = useGrades();

    const handleOk = (values) => {
        values.currentGrade = typeof values.currentGrade === 'object' ? values.currentGrade.value : values.currentGrade;
        updateTrainingMutate({ data: values, id: data?.id });
        // console.log(values);
        setUpdateTrainingModal(false);
    };

    const handleCancel = () => {
        setUpdateTrainingModal(false);
    };

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
                                value: data?.trainingDetail?.map(training => ({
                                    label: training?.school?.name,
                                    value: training?.school?.id
                                }))
                            },
                            {
                                name: ["trainingStatus"],
                                value: data?.trainingStatus
                            },
                            {
                                name: ["trainer"],
                                value: {
                                    label: data?.trainer?.username,
                                    value: data?.trainer?.id
                                }
                            },
                            {
                                name: ["grades"],
                                value: data?.trainingDetail[0]?.grades?.map(grade => ({
                                    label: grade?.grades,
                                    value: grade?.id
                                }))
                            },
                            {
                                name: ["subject"],
                                value: data?.trainingDetail[0]?.subject
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
                                value: data?.startDate && dayjs(data?.startDate, "YYYY-MM-DD")
                            },
                            {
                                name: ["startTime"],
                                value: data?.startTime && dayjs(data?.startTime, "HH:mm")
                            },
                            {
                                name: ["endTime"],
                                value: data?.endTime && dayjs(data?.endTime, "HH:mm")
                            }
                        ]}

                    >

                        <Form.Item label="School" name="schools" rules={[{ required: true, message: "Please select the school" }]}>
                            <Select placeholder="Select school"
                                mode='multiple'
                                disabled />
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

                        <Form.Item label="Subject" name="subject" rules={[{ required: true, message: "Please select the Training Type" }]}>
                            <Select
                                placeholder="Subject"
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
                    </Form>

                </div>
            </Modal>
        </>
    );
};