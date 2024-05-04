import LinkComponent from './LinkComponent';
import { Links } from '../../utilities/MenuItems';
import { useEffect, useState } from 'react';
import { useUserInfo } from '../../hooks/token_hooks';
import { LuFileSpreadsheet, LuSchool } from 'react-icons/lu';


const Sidebar = () => {
    const [links, setLinks] = useState(Links());
    const { is_am_om } = useUserInfo()

    const sheet_menu = [
        {
            id: 3,
            label: "Sheets",
            link: "/sheets",
            icon: <LuFileSpreadsheet />
        },
        {
            id:4,
            label: "Schools",
            link: "/schools",
            icon: <LuSchool />
        }
    ]

    useEffect(() => {
        is_am_om && setLinks([...links, ...sheet_menu])
    }, [])

    return (
        <div className='h-full w-full flex items-center flex-col gap-8'>
            {/* Logo Section  */}
            <img src='/images/logo.jpg' className='rounded-full w-24 h-24' />

            {/* Menu Section */}
            <div className='flex flex-col w-full gap-4 items-center justify-center'>
                {
                    links?.map((menu) => (
                        <LinkComponent key={menu.id} label={menu.label} link={menu.link} icon={menu.icon} />
                    ))
                }
            </div>

        </div>
    );
};
export default Sidebar;