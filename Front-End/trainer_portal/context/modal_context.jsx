import { createContext, useState } from "react";

export const ModalContext = createContext(null);

const ModalContextProvider = ({children}) => {
    const [confirmModal, setConfirmModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addTrainingModal, setTrainingModal] = useState(false);
    const [addSchoolModal, setSchoolModal] = useState(false);

    return (
        <ModalContext.Provider value={{confirmModal, setConfirmModal, editModal, setEditModal, addTrainingModal, setTrainingModal, setSchoolModal, addSchoolModal}}>
            {children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider