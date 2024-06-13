import { Button, DatePicker, Form, Modal, Select, TimePicker } from 'antd'
import React, { useContext, useEffect } from 'react'
import { ModalContext } from '../context/modal_context'
import useSchools from '../hooks/fetch_schools';
import { TrainingType } from '../utilities/MenuItems';
import dayjs from 'dayjs';
import { useUserInfo } from '../hooks/token_hooks';
import { useTraining } from '../hooks/training_hook';
import useGrades from '../hooks/grades_hook';


// Generate list of number from 0 to 60 excluding 0, 30
const disabledMinutes = Array.from({ length: 61 }, (_, i) => i).filter(num => num !== 0 && num !== 30).map(num => {
    return num
})

// Get the todays date in YYYY-MM-DD format

const disabledHours = [0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 13, 14, 16, 18, 19, 20, 21, 22, 23];

function RequestTraining({ data }) {
    const { requestTrainingModal, setRequestTrainingModal } = useContext(ModalContext);
    const { schoolOptions } = useSchools();
    const { requestTrainingMutate, updateRequestedTrainingMutate } = useTraining();
    const { userInfo } = useUserInfo();
    const [form] = Form.useForm()
    const { loading, grades } = useGrades()

    const handleCancle = () => {
        form.resetFields();
        setRequestTrainingModal(false);
    }

    const handleSubmit = (value) => {
        value["school"] = typeof value["school"] === "object" ? value["school"].value : value["school"];
        value["grades"] = typeof value["grades"][0] === "object" ? value["grades"].map(grade => grade.value) : value["grades"];
        value["startDate"] = dayjs(value["startDate"]).format("YYYY-MM-DD");
        // Add 1.5 hr to the startTime and store into endTime
        value["endTime"] = dayjs(value["startTime"]).add(1.5, 'hour').format("HH:mm")
        value["startTime"] = dayjs(value["startTime"]).format("HH:mm");
        value["requestor"] = userInfo?.id
        // console.log(value)
        data ? updateRequestedTrainingMutate({data: value, id: data.id}) : requestTrainingMutate(value);
        setRequestTrainingModal(false);
        form.resetFields();
    }

    return (
        <Modal open={requestTrainingModal} title="Request Training" onCancel={handleCancle} centered footer={null}
        >

            <Form form={form} layout='vertical' onFinish={handleSubmit}
                fields={[
                    {
                        name: ["school"],
                        value: {
                            label: data?.school?.name,
                            value: data?.school?.id
                        }
                    },
                    {
                        name: ["subject"],
                        value: data?.subject
                    },
                    {
                        name: ["grades"],
                        value: data?.grades?.map(grade => ({ label: grade.grades, value: grade.id }))
                    },
                    {
                        name: ["startDate"],
                        value: data && dayjs(data?.startDate, "YYYY-MM-DD")
                    },
                    {
                        name: ["startTime"],
                        value: data && dayjs(data?.startTime, "HH:mm")
                    }
                ]}
            >
                <Form.Item tooltip="Please Select School Name" name="school" label="School Name" rules={[{ required: true, message: "Please Select School Name" }]}>
                    <Select placeholder="Select School Name" options={schoolOptions} allowClear showSearch optionFilterProp='label' />
                </Form.Item>

                <div className='flex gap-2'>
                    <Form.Item label="Subject" name="subject" tooltip="Please Select Subject Name" rules={[{ required: true, message: "Please Select Subject Name" }]} className='w-full' >
                        <Select placeholder="Select Subject" allowClear options={TrainingType} />
                    </Form.Item>

                    <Form.Item label="Grade" name="grades" tooltip="Please Select Grade" className='w-full' rules={[{ required: true, message: "Please Select Grade" }]}>
                        <Select placeholder="Select Grade" mode="multiple" allowClear options={grades?.map(grade => ({ label: grade.grades, value: grade.id }))} loading={loading} />
                    </Form.Item>
                </div>

                <div className='w-full flex gap-2'>
                    <Form.Item label="Start Date" name="startDate" tooltip="Please Select Start Date" className='w-full' rules={[{ required: true, message: "Please Select Start Date" }]}>
                        <DatePicker placeholder="Select Start Date" className='w-full' format={"YYYY-MM-DD"} allowClear />
                    </Form.Item>

                    <Form.Item label="Start Time" name="startTime" tooltip="Please select the start Time" className='w-full' rules={[{ required: true, message: "Please select the start Time" }]}>
                        <TimePicker placeholder='Start Time' className='w-full' format={"HH:mm"} allowClear
                            disabledTime={() => ({
                                disabledHours: () => disabledHours,
                                disabledMinutes: () => disabledMinutes
                            })}
                            hideDisabledOptions
                        />
                    </Form.Item>
                </div>

                <div className='w-full flex justify-end gap-2'>
                    <Button>Cancle</Button>

                    {
                        data ?
                            <Button htmlType='submit' type='primary'>Update</Button>
                            :
                            <Button htmlType='submit' type='primary'>Submit</Button>
                    }
                </div>
            </Form>
        </Modal>
    )
}

export default RequestTraining