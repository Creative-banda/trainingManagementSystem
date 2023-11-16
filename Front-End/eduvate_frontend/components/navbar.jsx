'use client';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';

export default function AppNavbar() {
  return (
    <Navbar>
      <div className="w-full flex justify-end">

        {/* User Dropdown Setting Menus */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Mohd Shoib</span>
            <span className="block truncate text-sm font-medium">mohd.shoib@orchids.edu.in</span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>

      </div>
    </Navbar>
  );
}
