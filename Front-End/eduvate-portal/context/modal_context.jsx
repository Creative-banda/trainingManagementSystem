import { createContext, useState } from "react";

export const ModalContext = createContext(null);

const ModalContextProvider = ({children}) => {
    const [confirmModal, setConfirmModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addTrainingModal, setTrainingModal] = useState(false);
    const [addSchoolModal, setSchoolModal] = useState(false);
    const [editSchoolModel, setEditSchoolModal] = useState(false);
    const [deleteSchoolModel, setDeleteSchoolModal] = useState(false);

    return (
        <ModalContext.Provider value={{confirmModal, setConfirmModal, editModal, setEditModal, addTrainingModal, setTrainingModal, setSchoolModal, addSchoolModal, editSchoolModel, setEditSchoolModal, deleteSchoolModel, setDeleteSchoolModal}}>
            {children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider