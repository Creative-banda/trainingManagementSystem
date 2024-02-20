import { DashboardOutlined, TableOutlined } from '@ant-design/icons';
export const Links = [
    {
        id: 1,
        label: "Dashboard",
        link: "/",
        icon: <DashboardOutlined className='pl-4'/>
    },
    {
        id:2,
        label: "Trainings",
        link: "/trainings",
        icon: <TableOutlined className='pl-4'/>
    }
]

const trainings = [
    {
        id : 1,
        schools : ["Radcliffe Hyderabad","Sri Jayanti Vidyalaya","Jain College"],
        status : "ONGOING",
        trainingType: "ROBOTICS",
        startTime: "12:00",
    },
    {
        id : 2,
        schools : ["ABS School","Sri Jayanti Vidyalaya","DAV School College"],
        status : "ONGOING",
        trainingType: "COMPUTER SCIENCE",
        startTime: "14:00",
    },
    {
        id : 3,
        schools : ["Geetha Healthcare","Sri Jayanti Vidyalaya","Jain College"],
        status : "ONGOING",
        trainingType: "COMPUTER SCIENCE",
        startTime: "16:00",
    }
]