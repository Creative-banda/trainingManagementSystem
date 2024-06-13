import { createContext, useState } from "react";

export const ModalContext = createContext(null);

const ModalContextProvider = ({children}) => {
    const [editModal, setEditModal] = useState(false);
    const [addTrainingModal, setTrainingModal] = useState(false);
    const [transferTrainingModal, setTransferTrainingModal] = useState(false);
    const [addSchoolModal, setSchoolModal] = useState(false);
    const [editSchoolModel, setEditSchoolModal] = useState(false);
    const [trainingSheetModifyState, setTrainingSheetModifyState] = useState(false);

    return (
        <ModalContext.Provider value={{editModal, setEditModal, addTrainingModal, setTrainingModal, setSchoolModal, addSchoolModal, editSchoolModel, setEditSchoolModal, trainingSheetModifyState, setTrainingSheetModifyState, transferTrainingModal, setTransferTrainingModal}}>
            {children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider