import { Button, Form, Input, Modal, Select, Skeleton } from "antd"
import { useContext } from "react"
import { ModalContext } from "../context/modal_context"
import useGrades from "../hooks/fetch_grades";
import useUserOptions from "../hooks/fetch_user";
import { DeliveredProcedureOutlined } from "@ant-design/icons";
import { useSchoolById } from "../hooks/fetch_schools";

const EditSchoolModel = ({ schoolData }) => {
    const { editSchoolModel, setEditSchoolModal } = useContext(ModalContext);
    const { grades, gradeLoading } = useGrades();
    const { updateSchool, updating } = useSchoolById();
    const [form] = Form.useForm();
    const { userName } = useUserOptions();
    // console.log(id);




    const handleSubmit = ({ grades, am, om, ...rest }) => {
        const values = {
            ...rest,
            grades: typeof grades[0] === 'object' ? grades.map(item => item.value) : grades,
            am: typeof am === 'object' ? am.value : am,
            om: typeof om === 'object' ? om.value : om
        };
        console.log(values);

        updateSchool(schoolData?.id, values);

    }

    const handleClose = () => {
        form.resetFields();
        setEditSchoolModal(false);
    }


    return (
        <div>
            <Modal title="Edit School" open={editSchoolModel} onCancel={handleClose} footer={[]} centered>
                <Form layout="vertical" onFinish={handleSubmit} form={form}
                    fields={[
                        {
                            name: ["name"],
                            value: schoolData?.name
                        },
                        {
                            name: ["address"],
                            value: schoolData?.address
                        },
                        {
                            name: ["catagory"],
                            value: schoolData?.catagory
                        },
                        {
                            name: ["grades"],
                            value: schoolData?.grades?.map(grade => ({ label: grade?.grades, value: grade?.id }))
                        },
                        {
                            name: ["am"],
                            value: {
                                label: schoolData?.am?.username,
                                value: schoolData?.am?.id
                            }
                        },
                        {
                            name: ["om"],
                            value: {
                                label: schoolData?.om?.username,
                                value: schoolData?.om?.id
                            }
                        },
                        {
                            name: ["contact"],
                            value: schoolData?.contact
                        },
                        {
                            name: ["erp_code"],
                            value: schoolData?.erp_code
                        }
                    ]}
                >
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
                            options={[
                                { value: "CATAGORY A", label: "Catagory A" },
                                { value: "CATAGORY B", label: "Catagory B" },
                                { value: "CATAGORY C", label: "Catagory C" },
                                { value: "CATAGORY D", label: "Catagory D" }
                            ]} allowClear
                        // searchValue="value"
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

                    <div className="flex gap-2">
                        <Form.Item label="Academic Manager" name="am" rules={[{ required: true, message: "Choose the Academic Manager" }]} className="mb-2 w-full">
                            <Select
                                name="am" placeholder="Select the AM"
                                allowClear showSearch
                                options={userName}
                                optionFilterProp="label"
                            />
                        </Form.Item>

                        <Form.Item label="Operational Manager" name="om" rules={[{ required: true, message: "Choose the Operational Manager" }]} className="mb-2 w-full">
                            <Select
                                name="om" placeholder="Select the OM"
                                allowClear showSearch
                                options={userName}
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </div>

                    <div className="flex gap-2">
                        <Form.Item label="Phone Number" name="contact" rules={[
                            {
                                required: true,
                                message: "Choose a valid phone number",
                                pattern: new RegExp(/^[6-9]\d{9}$/g)
                            }
                        ]} className="mb-2 w-full">
                            <Input name="contact" placeholder="Phone Number" allowClear />
                        </Form.Item>

                        <Form.Item label="ERP Number" name="erp_code" rules={[
                            { required: true, message: "Choose a valid phone ERP Code" }]} className="mb-2 w-full">
                            <Input name="erp_code" placeholder="Phone Number" allowClear />
                        </Form.Item>
                    </div>

                    <div className='flex gap-2 justify-end items-center mb-2'>
                        <Form.Item>
                            <Button onClick={handleClose}>Go Back</Button>
                        </Form.Item>

                        <Form.Item>
                            <Button danger htmlType='submit' icon={<DeliveredProcedureOutlined />} loading={updating} >Submit</Button>
                        </Form.Item>
                    </div>

                </Form>
            </Modal>
        </div>
    )
}

export default EditSchoolModel