import { Button, Form, Input, Modal, Select } from "antd";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../context/modal_context";
import { useSheet } from "../hooks/fetch_sheet";
import { useParams } from "react-router-dom";

export default function TrainingModifyModal({ sheetData = { data: {}, id: "" } }) {
    const { trainingSheetModifyState, setTrainingSheetModifyState } = useContext(ModalContext);
    const [trainingData, setTrainingData] = useState();
    const {id} = useParams();
    const { patchSheetData, postSchoolSheet } = useSheet({ id: id });
    console.log(trainingData);

    const handleUpdate = async (val) => {
        if (sheetData.id) {
            console.log(val);
            patchSheetData({ id: trainingData?.id, data: val });
            setTrainingData({ data: {}, id: "" });
            setTrainingSheetModifyState(false);
        } else {
            console.log(val);
            postSchoolSheet(val);
            setTrainingSheetModifyState(false);
        }
    }

    const handleCancel = () => {
        setTrainingSheetModifyState(false);
        setTrainingData({ data: {}, id: "" });
    }

    useEffect(() => {
        setTrainingData(sheetData);
    }, [trainingSheetModifyState]);

    return (
        <Modal open={trainingSheetModifyState} title="Edit Sheet Data" onCancel={() => handleCancel()} centered width={"90%"}
            footer={[]}
        >
            <Form
                layout="vertical" name="basic"
                className="flex gap-4"
                fields={[
                    {
                        name: ["grade"],
                        value: trainingData?.data?.grade
                    },
                    {
                        name: ["topic"],
                        value: trainingData?.data?.topic
                    },
                    {
                        name: ["date"],
                        value: trainingData?.data?.date
                    },
                    {
                        name: ["duration"],
                        value: trainingData?.data?.duration
                    },
                    {
                        name: ["conducted"],
                        value: trainingData?.data?.conducted
                    },
                    {
                        name: ["trainerRemark"],
                        value: trainingData?.data?.trainerRemark
                    }
                ]}

                onFinish={handleUpdate}
            >
                <div className="flex-1">
                    <Form.Item label="Grade" name="grade">
                        <Input value={trainingData?.data?.grade} tabIndex={1} />
                    </Form.Item>

                    <Form.Item label="Topic" name="topic">
                        <Input value={trainingData?.data?.topic} />
                    </Form.Item>

                    <Form.Item label="Date" name="date">
                        <Input value={trainingData?.data?.date} />
                    </Form.Item>

                </div>

                <div className="flex-1">
                    <Form.Item label="Duration" name="duration">
                        <Input value={trainingData?.data?.duration} />
                    </Form.Item>

                    <Form.Item label="Conducted" name="conducted">
                        <Input value={trainingData?.data?.conducted} />
                    </Form.Item>

                    <Form.Item label="Trainer Remark" name="trainerRemark">
                        <Input value={trainingData?.data?.trainerRemark} />
                    </Form.Item>
                    <Form.Item >
                        {trainingData?.id ? <Button htmlType="submit">Update</Button> : <Button htmlType="submit">ADD</Button>}
                        <Button onClick={() => handleCancel()}>Cancle</Button>
                    </Form.Item>
                </div>

            </Form>
        </Modal>
    )
}


export function TrainingAddModal() {
    const { trainingSheetAddState, setTrainingSheetAddState } = useContext(ModalContext);
    // console.log(school);
    return (
        <Modal open={trainingSheetAddState} onCancel={() => setTrainingSheetAddState(false)} centered width={"90%"}
            footer={[
                <Button key="back" onClick={() => setTrainingSheetAddState(false)}> Cancle </Button>,
                <Button key="submit" type="danger">Submit</Button>
            ]}
        >

        </Modal>
    )
}
