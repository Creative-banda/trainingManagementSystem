// import { DashboardOutlined, TeamOutlined, TableOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { GiTeacher } from "react-icons/gi";
import { FaSchool, FaCalendarDays } from "react-icons/fa6";
import { RiDashboard3Fill } from "react-icons/ri";
import { PiChalkboardTeacherFill } from "react-icons/pi";

export const SidebarLinks = [
    {
        key: '1',
        icon: <RiDashboard3Fill />,
        label: 'Dashboard',
        path: '/'

    },
    {
        key: '2',
        icon: <FaSchool />,
        label: 'Schools',
        path:'/schools'
    },
    {
        key: '3',
        icon: <GiTeacher />,
        label: 'Training',
        children: [
            {
                key: '3.1',
                icon: <PiChalkboardTeacherFill />,
                label: 'All Trainings',
                path: '/training/'
            },
            {
                key: '3.2',
                icon: <LiaChalkboardTeacherSolid />,
                label: 'Assign Training',
                path: '/assign/'
            }
        ]
    },
    {
        key: '4',
        icon: <FaCalendarDays />,
        label: 'Scheduller',
        path: '/scheduller'
    }
]
