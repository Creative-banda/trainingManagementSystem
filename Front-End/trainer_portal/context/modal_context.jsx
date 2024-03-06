import { createContext, useState } from "react";

export const ModalContext = createContext(null);

const ModalContextProvider = ({children}) => {
    const [confirmModal, setConfirmModal] = useState(false);
    const [updateTrainingModal, setUpdateTrainingModal] = useState(false);
    const [trainingSheetModifyState, setTrainingSheetModifyState] = useState(false);
    const [trainingSheetAddState, setTrainingSheetAddState] = useState(false);

    return (
        <ModalContext.Provider value={{confirmModal, setConfirmModal, updateTrainingModal, setUpdateTrainingModal, trainingSheetModifyState, setTrainingSheetModifyState, trainingSheetAddState, setTrainingSheetAddState}}>
            {children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider