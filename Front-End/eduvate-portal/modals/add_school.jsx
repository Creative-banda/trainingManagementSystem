import { Button, Form, Input, Modal, Select } from "antd"
import { useContext } from "react"
import { ModalContext } from "../context/modal_context"
import useGrades from "../hooks/fetch_grades";
import useUserOptions from "../hooks/fetch_user";
import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import useSchoolSubmit from "../hooks/school_hook";
import { SchoolCatagory } from "../utils/MenuItems";

const SchoolModal = () => {
    const { addSchoolModal, setSchoolModal } = useContext(ModalContext);
    const { grades, gradeLoading } = useGrades();
    const { userName } = useUserOptions();
    const [form] = Form.useForm();
    const { registerSchool, error, submitting, response } = useSchoolSubmit();
          

    const handleSubmit = (value) => {
        registerSchool(value);
        if (error) {
            console.log(error);
        } else if (response) {
            form.resetFields();
            console.log(response);
        }
    }

    const handleClose = () => {
        form.resetFields();
        setSchoolModal(false);
    }


    return (
        <div>
            <Modal title="Add School" open={addSchoolModal} onCancel={handleClose} footer={[]} centered>
                <Form layout="vertical" onFinish={handleSubmit} form={form}>
                    <Form.Item label="School Name" name="name" rules={[{ required: true, message: "School Name can not be empty" }]} className="mb-2">
                        <Input
                            name="name" placeholder="School Name" allowClear
                        />
                    </Form.Item>

                    <Form.Item label="School Address" name="address" rules={[{ required: true, message: "School address is required" }]} className="mb-2">
                        <Input.TextArea rows={3} name="address" allowClear />
                    </Form.Item>

                    <Form.Item label="School Catagory" name="catagory" className="mb-2" rules={[{ required: true, message: "School address is required" }]}>
                        <Select
                            name="catagory" placeholder="Select School Catagory"
                            options={SchoolCatagory} allowClear
                        />
                    </Form.Item>

                    <Form.Item label="Opted Grades" name="grades" rules={[{ required: true, message: "Choose the Grade/s" }]} className="mb-2">
                        <Select
                            name="grades" placeholder="Select the Grades"
                            options={grades}
                            mode="multiple"
                            optionFilterProp="label"
                            loading={gradeLoading}
                        />
                    </Form.Item>

                    <Form.Item label="Academic Manager" name="am" rules={[{ required: true, message: "Choose the Academic Manager" }]} className="mb-2">
                        <Select
                            name="am" placeholder="Select the AM"
                            allowClear showSearch
                            options={userName}
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item label="Operational Manager" name="om" rules={[{ required: true, message: "Choose the Operational Manager" }]} className="mb-2">
                        <Select
                            name="om" placeholder="Select the OM"
                            allowClear showSearch
                            options={userName}
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item label="Phone Number" name="contact" rules={[
                        {
                            required: true,
                            message: "Choose a valid phone number",
                            pattern: new RegExp(/^[6-9]\d{9}$/g)
                        }
                    ]} className="mb-2">
                        <Input name="contact" placeholder="Phone Number" allowClear />
                    </Form.Item>

                    <Form.Item label="ERP Number" name="erp_code" rules={[
                        { required: true, message: "Choose a valid phone ERP Code" }]} className="mb-2">
                        <Input name="erp_code" placeholder="Phone Number" allowClear />
                    </Form.Item>

                    <div className='flex gap-2 justify-end items-center mb-2'>
                        <Form.Item>
                            <Button type='primary' onClick={handleClose}>Go Back</Button>
                        </Form.Item>

                        <Form.Item>
                            <Button danger htmlType='submit' icon={submitting ? <LoadingOutlined /> : <SendOutlined />}>Submit</Button>
                        </Form.Item>
                    </div>

                </Form>
            </Modal>
        </div>
    )
}

export default SchoolModal