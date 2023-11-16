import { Sidebar } from 'flowbite-react';
import {HiChartPie, HiOfficeBuilding, HiUser} from 'react-icons/hi';
import { FaChalkboardTeacher } from "react-icons/fa";

function AppSidebar() {
    return (
        <Sidebar aria-label="Sidebar with logo branding example" className=' bg-slate-400'>
            <Sidebar.Logo href="#" img="/next.svg" imgAlt="Flowbite logo" />
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="#" icon={HiChartPie}>
                        Dashboard
                    </Sidebar.Item>
                    {/* <Sidebar.Collapse
                        icon={HiShoppingBag}
                        label="E-commerce"
                        renderChevronIcon={(theme, open) => {
                            const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                            return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                        }}
                    >
                        <Sidebar.Item href="#">Products</Sidebar.Item>
                        <Sidebar.Item href="#">Sales</Sidebar.Item>
                        <Sidebar.Item href="#">Refunds</Sidebar.Item>
                        <Sidebar.Item href="#">Shipping</Sidebar.Item>
                    </Sidebar.Collapse> */}
                    <Sidebar.Item href="#" icon={FaChalkboardTeacher}>
                        Training
                    </Sidebar.Item>
                    <Sidebar.Item href="trainers" icon={HiUser}>
                        Trainers
                    </Sidebar.Item>
                    <Sidebar.Item href="schools" icon={HiOfficeBuilding}>
                        Schools
                    </Sidebar.Item>
                   
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}


export default AppSidebar