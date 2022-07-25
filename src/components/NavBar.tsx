import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../App';

import { Home } from '@styled-icons/ionicons-outline/Home';

import { User } from '@styled-icons/boxicons-regular/User';
import { BellFill } from '@styled-icons/bootstrap/BellFill';
import { MoreHorizontalOutline } from '@styled-icons/evaicons-outline/MoreHorizontalOutline';
import { Devices } from '@styled-icons/boxicons-regular/Devices';
import { CustomerService } from '@styled-icons/remix-fill/CustomerService';
import { QueryStats } from '@styled-icons/material-outlined/QueryStats';

import LinkList from './LinkList';
import { Menu } from '@headlessui/react';
const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const paths = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <Home size="24" className="ml-8" />,
    },
    { path: '/broadcast', label: 'Broadcast', roles: ['CustomerSupport'] },
  ];
  const LINK_LIST = [
    {
      title: 'User',
      icon: <User size="24" className="ml-8" />,
      roles: ['CustomerSupport', 'UserAdmin'],
      items: [
        {
          roles: ['CustomerSupport', 'UserAdmin'],
          label: 'Customer Account',
          path: '/customer',
        },
        {
          roles: ['UserAdmin'],
          label: 'Staff Account',
          path: '/staff',
        },
        {
          roles: ['UserAdmin'],
          label: 'Staff Role',
          path: '/staff/role',
        },
      ],
    },
    {
      title: 'Assets',
      icon: <Devices size="24" className="ml-8" />,
      roles: ['Technician'],
      items: [
        {
          roles: ['Technician'],
          label: 'Equipment',
          path: '/equipment',
        },
        {
          roles: ['Technician'],
          label: 'Chemical Inventory',
          path: '/chemical',
        },
      ],
    },
    {
      title: 'Usage',
      icon: <QueryStats size="24" className="ml-8" />,
      roles: ['Technician', 'CustomerSupport'],
      items: [
        {
          roles: ['Technician'],
          label: 'Water Pump Usage',
          path: '/pumpusage',
        },
        {
          roles: ['Technician', 'CustomerSupport'],
          label: 'Water Usage',
          path: '/waterusage',
        },
      ],
    },
    {
      title: 'Customer',
      icon: <CustomerService size="24" className="ml-8" />,
      roles: ['CustomerSupport'],
      items: [
        {
          roles: ['CustomerSupport'],
          label: 'Bill',
          path: '/bill',
        },
        {
          roles: ['CustomerSupport'],
          label: 'Reports',
          path: '/reports',
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    setUser({
      userId: '',
      username: '',
      password: '',
      createdAt: '',
      fullName: '',
      gender: 'M',
      email: '',
      phone: '',
      type: '',
      staffRole: '',
    });
    toast('Successfully logged out!');
    navigate('/');
  };

  return (
    <nav className="w-[15vw] border-r-2 border-gray-900 h-full flex flex-col">
      <div className="w-full h-[15vh]">{/* Potential Logo */}</div>
      <div className="w-full">
        {paths.map((path, index) => {
          if (
            (path.roles && path.roles.includes(user.staffRole)) ||
            !path.roles
          ) {
            return (
              <>
                <Link
                  to={path.path}
                  key={index}
                  className="inline-flex w-full items-center h-12"
                >
                  {useLocation().pathname === path.path ? (
                    <div className="rounded-r-md h-full w-[6px] bg-gray-900">
                      &nbsp;
                    </div>
                  ) : (
                    <div className="rounded-r-md h-full w-[6px] bg-transparent">
                      &nbsp;
                    </div>
                  )}
                  {path.icon}
                  <span className="ml-8 text-xl">{path.label}</span>
                </Link>
                <div className="w-4/5 h-[2px] bg-gray-900 mx-auto">&nbsp;</div>
              </>
            );
          }
        })}
        {LINK_LIST.map((list, index) => (
          <LinkList
            key={index}
            title={list.title}
            icon={list.icon}
            items={list.items}
            roles={list.roles}
          />
        ))}
      </div>
      <div className="w-4/5 mt-auto mb-20 mx-auto inline-flex">
        <img src="images/AvatarFill.png" className="w-12" />
        <div className="flex flex-col ml-4">
          <span className="text-xl">{user.username}</span>
          <span className="text-gray-500">{user.staffRole}</span>
        </div>
        <Menu>
          <Menu.Button className="ml-2">
            <MoreHorizontalOutline size="28" />
          </Menu.Button>
        </Menu>
      </div>
    </nav>
  );
};

export default NavBar;
