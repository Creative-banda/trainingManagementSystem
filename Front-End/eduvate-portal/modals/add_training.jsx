import React, { useContext, useEffect } from 'react';
import { Button, Modal, Select, Form } from 'antd';
import { ModalContext } from '../context/modal_context';
import { SendOutlined } from '@ant-design/icons';
import useUserOptions from '../hooks/fetch_user';
import { useTrainings } from '../hooks/fetch_training';
import useRequestTraining from '../hooks/request_training_hook';


const AddTrainingModal = () => {
    const { addTrainingModal, setTrainingModal } = useContext(ModalContext);


    // console.log(data);
    const { userName } = useUserOptions();
    const { addTrainingMutate, loadingTraining } = useTrainings();
    const { fetchRequestedTraining, requestedTraining, loading } = useRequestTraining();
    const [form] = Form.useForm();

    const handleOk = async (values) => {
        console.log(values);

        addTrainingMutate(values)
        form.resetFields();
        setTrainingModal(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setTrainingModal(false);
    };


    useEffect(() => {
        fetchRequestedTraining({ status: "PENDING" });
    }, [addTrainingModal])

    return (
        <>
            <Modal title="Assign Training" open={addTrainingModal} onOk={handleOk} onCancel={handleCancel}
                footer={[]} centered
            >
                <div>
                    <Form
                        name='basic' layout='vertical' onFinish={handleOk} form={form}
                    >

                        <Form.Item label="Trainings" name="trainings" rules={[{ required: true, message: "Please select at least one training" }]}>
                            <Select
                                name="trainings"
                                mode='multiple'
                                placeholder="Select Trainings"
                                loading={loading}
                                options={
                                    requestedTraining?.map((training) => ({
                                        value: training?.id,
                                        label: training?.school?.name,
                                        desc: training
                                    }))
                                }
                                optionFilterProp='label'
                                optionRender={({ data }) => (
                                    <div className='flex justify-between flex-wrap'>
                                        <p>{data?.label}</p>
                                        <p>{data?.desc?.startDate}</p>
                                        <p>{data?.desc?.startTime}</p>
                                        <p>{data?.desc?.subject}</p>
                                    </div>
                                )
                                }
                            />
                        </Form.Item>

                        <Form.Item label="Assign Trainer" name="trainer" rules={[{ required: true, message: "Please select the trainer/s" }]}>
                            <Select
                                placeholder="Please select a Trainer"
                                options={userName}
                                optionFilterProp='label'
                                optionRender={({ data }) => (
                                    <div className='flex justify-between'>
                                        <p>{data?.label}</p>
                                        <p className={`${data?.desc < 4 ? "text-green-400" : "text-red-400"}`}>{data?.desc}</p>
                                    </div>
                                )}
                            />
                        </Form.Item>


                        <div className='flex gap-2 justify-end items-center'>
                            <Form.Item >
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


export default AddTrainingModal