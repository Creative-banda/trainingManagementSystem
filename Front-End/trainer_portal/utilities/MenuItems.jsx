import { DashboardOutlined } from '@ant-design/icons';
import { GiTeacher } from "react-icons/gi";
import { LuFileSpreadsheet } from "react-icons/lu";
import { useUserInfo } from '../hooks/token_hooks';
const { is_am_om } = useUserInfo();

export const TrainingStatus = [
    { value: "COMPLETED", label: "COMPLETED" },
    { value: "ONGOING", label: "ONGOING" },
    { value: "PENDING", label: "PENDING" },
    { value: "CANCELLED", label: "CANCELLED" },
]

export const RequestedTrainingStatus = [
    { value: "PENDING", label: "PENDING" },
    { value: "APPROVED", label: "APPROVED" },
    { value: "REJECTED", label: "REJECTED" },
]

export const TrainingType = [
    { value: "COMPUTER SCIENCE", label: "COMPUTER SCIENCE" },
    { value: "ROBOTICS", label: "ROBOTICS" },
    { value: "AEROMODELLING", label: "AEROMODELLING" },
    { value: "DOUBT SESSION", label: "DOUBT SESSION" },
]

export const SchoolCatagory = [
    { value: "CATAGORY A", label: "CATAGORY A" },
    { value: "CATAGORY B", label: "CATAGORY B" },
    { value: "CATAGORY C", label: "CATAGORY C" },
    { value: "CATAGORY D", label: "CATAGORY D" },
]


export const Links = () => {
    let link = [
        {
            key: 1,
            label: "Dashboard",
            path: "/",
            icon: <DashboardOutlined />
        },
        {
            key: 2,
            label: "Trainings",
            path: "/trainings",
            icon: <GiTeacher />
        },
    ]

    return link
}



