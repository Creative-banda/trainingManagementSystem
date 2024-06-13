import { Button, Form, Input, Modal, Select } from "antd"
import { useContext } from "react"
import useGrades from "../hooks/fetch_grades";
import { SendOutlined } from "@ant-design/icons";
import { ModalContext } from "../context/modal_context";
import useSchools, { useSchoolById } from "../hooks/fetch_schools";
import { SchoolCatagory } from "../utilities/MenuItems";
import useUserOptions from "../hooks/fetch_user";

const SchoolModal = ({ data, resetData }) => {
    const { schoolModal, setSchoolModal } = useContext(ModalContext);
    const { updateSchoolMutate } = useSchoolById();
    const { grades, gradeLoading } = useGrades();
    const { userName } = useUserOptions();
    const [form] = Form.useForm();
    const { registerSchoolMutate } = useSchools();

    // console.log(data);
    const handleSubmit = (value) => {
        if (data) {
            value["am"] = typeof value["am"] === "object" ? value["am"].value : value["am"];
            value["om"] = typeof value["om"] === "object" ? value["om"].value : value["om"];
            value["grades"] = typeof value["grades"][0] === "object" ? value["grades"].map(grade => grade.value) : value["grades"];
            // console.log(data.id);
            updateSchoolMutate({id: data.id, data: value});
        } else {
            registerSchoolMutate(value);
            setSchoolModal(false);
        }

        handleClose();
    }

    const handleClose = () => {
        form.resetFields();
        resetData(null);
        setSchoolModal(false);
    }




    return (
        <div>
            <Modal title="Add School" open={schoolModal} onCancel={handleClose} footer={[]} centered>
                <Form layout="vertical" onFinish={handleSubmit} form={form}
                    fields={[
                        {
                            name: "name",
                            value: data?.name,
                        },
                        {
                            name: "address",
                            value: data?.address
                        },
                        {
                            name: "catagory",
                            value: data?.catagory
                        },
                        {
                            name: "grades",
                            value: data?.grades?.map((grade) => (
                                { label: grade.grades, value: grade.id }
                            ))
                        },
                        {
                            name: "am",
                            value: {
                                label: data?.am?.username,
                                value: data?.am?.id
                            }
                        },
                        {
                            name: "om",
                            value: {
                                label: data?.om?.username,
                                value: data?.om?.id
                            }
                        },
                        {
                            name: "contact",
                            value: data?.contact
                        },
                        {
                            name: "erp_code",
                            value: data?.erp_code
                        }
                    ]}
                >
                    <Form.Item label="School Name" name="name" rules={[{ required: true, message: "School Name can not be empty" }]}>
                        <Input
                            name="name" placeholder="School Name" allowClear
                        />
                    </Form.Item>

                    <Form.Item label="School Address" name="address" rules={[{ required: true, message: "School address is required" }]}>
                        <Input.TextArea rows={3} name="address" allowClear />
                    </Form.Item>

                    <Form.Item label="School Catagory" name="catagory" rules={[{ required: true, message: "School address is required" }]}>
                        <Select
                            name="catagory" placeholder="Select School Catagory"
                            options={SchoolCatagory} allowClear
                        />
                    </Form.Item>

                    <Form.Item label="Opted Grades" name="grades" rules={[{ required: true, message: "Choose the Grade/s" }]}>
                        <Select
                            name="grades" placeholder="Select the Grades"
                            options={grades}
                            mode="multiple"
                            optionFilterProp="label"
                            loading={gradeLoading}
                        />
                    </Form.Item>

                    <div className="flex gap-2 w-full">
                        <Form.Item label="Academic Manager" name="am" rules={[{ required: true, message: "Choose the Academic Manager" }]} className="w-full">
                            <Select
                                name="am" placeholder="Select the AM"
                                allowClear showSearch
                                options={userName}
                                optionFilterProp="label"
                            />
                        </Form.Item>

                        <Form.Item label="Operational Manager" name="om" rules={[{ required: true, message: "Choose the Operational Manager" }]} className="w-full">
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
                            <Input name="contact" placeholder="Phone Number" pattern="^[6-9]\d{9}$" allowClear />
                        </Form.Item>

                        <Form.Item label="ERP Number" name="erp_code" rules={[
                            { required: true, message: "Choose a valid phone ERP Code" }]} className="w-full">
                            <Input name="erp_code" placeholder="ERP Number" allowClear />
                        </Form.Item>
                    </div>

                    <div className='flex gap-2 justify-end items-center mb-2'>
                        <Form.Item>
                            <Button onClick={handleClose}>Go Back</Button>
                        </Form.Item>

                        <Form.Item>
                            {
                                data ?
                                    <Button danger htmlType="submit"> Update </Button>
                                    :
                                    <Button danger htmlType='submit' icon={<SendOutlined />}>Submit</Button>
                            }
                        </Form.Item>
                    </div>

                </Form>
            </Modal>
        </div>
    )
}

export default SchoolModal