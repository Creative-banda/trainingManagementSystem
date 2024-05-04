import { DashboardOutlined, TeamOutlined, TableOutlined, ClockCircleOutlined } from '@ant-design/icons';

export const SidebarLinks = [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        link: '/'

    },
    {
        key: '2',
        icon: <TeamOutlined />,
        label: 'Schools',
        link:'/schools'
    },
    {
        key: '3',
        icon: <TableOutlined />,
        label: 'Training',
        link: '/training'
    },
    {
        key: '4',
        icon: <ClockCircleOutlined />,
        label: 'Scheduller',
        link: '/scheduller'
    }
]
