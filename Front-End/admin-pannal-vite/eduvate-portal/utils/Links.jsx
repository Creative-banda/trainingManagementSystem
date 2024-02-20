import { DashboardOutlined, TeamOutlined, TableOutlined, PoweroffOutlined } from '@ant-design/icons';

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
]