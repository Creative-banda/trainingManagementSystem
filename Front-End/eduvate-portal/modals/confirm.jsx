import React, { useContext, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { Context } from '../context/user_context';
import { ModalContext } from '../context/modal_context';
import api from '../interceptor/axios_interceptor';
import { useToken } from '../hooks/token_hooks';

const ConfirmModal = ({ id }) => {
    const { confirmModal, setConfirmModal } = useContext(ModalContext);
    const { isLoading, setIsLoading } = useContext(Context)
    const { access_token } = useToken();



    const handleDelete = async () => {
        setIsLoading(true);
        await api({
            method: "DELETE",
            url: `/training/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if (response.status === 204) {
                message.success("Training Deleted")
            } else {
                message.error("Something went wrong");
            }
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
        setConfirmModal(false);
    }

    const handleCancel = () => {
        setConfirmModal(false);
    }


    return (
        <Modal
            title="Do you want to delete this training?"
            open={confirmModal}
            onOk={handleDelete}
            confirmLoading={isLoading}
            onCancel={handleCancel}
            centered
            footer={[
                <Button key="back" onClick={handleCancel}> Cancle </Button>,
                <Button key="submit" onClick={handleDelete} danger loading={isLoading}> Delete </Button>
            ]}
        >
            <p>It will delete the training Data</p>
        </Modal>
    );
};
export default ConfirmModal;


export const DeleteSchoolModal = ({ id }) => {
    const { deleteSchoolModel, setDeleteSchoolModal } = useContext(ModalContext);
    const { access_token } = useToken();
    const [loading, setLoading] = useState(false);

    const deleteSchool = async () => {
        setLoading(true);
        await api({
            method: "DELETE",
            url: `/school/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            console.log(response);
            if (response.status === 204) {
                message.success("Successfully deleted");
                setDeleteSchoolModal(false);
            } else {
                message.error("Something went wrong");
            }
            setLoading(false)
        }).catch(error => {
            console.log(error);
            setLoading(false);
            message.error("Something went wrong");
        })
    }


    return (
        <Modal title="Do you want to delete this School" open={deleteSchoolModel} onCancel={() => setDeleteSchoolModal(false)} footer={[
            <Button key="back" onClick={() => setDeleteSchoolModal(false)}> Cancle </Button>,
            <Button key="submit" danger onClick={() => deleteSchool()} loading> Delete </Button>
        ]} centered>
            <p>It will delete the School</p>
        </Modal>
    )
}