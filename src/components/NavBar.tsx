import React, { Fragment, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { NotificationContext, UserContext } from '../App';

import { Home } from '@styled-icons/ionicons-outline/Home';
import { User } from '@styled-icons/boxicons-regular/User';
import { MegaphoneLoud } from '@styled-icons/fluentui-system-filled/MegaphoneLoud';
import { MoreHorizontalOutline } from '@styled-icons/evaicons-outline/MoreHorizontalOutline';
import { Devices } from '@styled-icons/boxicons-regular/Devices';
import { CustomerService } from '@styled-icons/remix-fill/CustomerService';
import { QueryStats } from '@styled-icons/material-outlined/QueryStats';

import LinkList from './LinkList';
import { Menu, Transition } from '@headlessui/react';
const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const { setNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();
  const paths = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <Home size="24" className="ml-4 2xl:ml-8" />,
    },
    {
      path: '/broadcast',
      label: 'Broadcast',
      roles: ['CustomerSupport'],
      icon: <MegaphoneLoud size="24" className="ml-4 2xl:ml-8" />,
    },
  ];
  const LINK_LIST = [
    {
      title: 'User',
      icon: <User size="24" className="ml-4 2xl:ml-8" />,
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
      ],
    },
    {
      title: 'Assets',
      icon: <Devices size="24" className="ml-4 2xl:ml-8" />,
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
        {
          roles: ['Technician'],
          label: 'Maintenance List',
          path: '/maintenance',
        },
      ],
    },
    {
      title: 'Usage',
      icon: <QueryStats size="24" className="ml-4 2xl:ml-8" />,
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
        {
          roles: ['Technician'],
          label: 'Chemical Usage',
          path: '/chemicalusage',
        },
      ],
    },
    {
      title: 'Customer',
      icon: <CustomerService size="24" className="ml-4 2xl:ml-8" />,
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
        {
          roles: ['CustomerSupport'],
          label: 'Water Rate',
          path: '/waterrate',
        },
      ],
    },
    {
      title: 'Assignments',
      icon: <User size="24" className="ml-4 2xl:ml-8" />,
      roles: ['CustomerSupport', 'Technician'],
      items: [
        {
          roles: ['CustomerSupport', 'Technician'],
          label: 'Assignment List',
          path: '/assignment',
        },
        {
          roles: ['CustomerSupport', 'Technician'],
          label: 'My Assignments',
          path: '/assignment/self',
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
    setNotifications([]);
    toast('Successfully logged out!');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 w-[15vw] border-r-2 border-gray-900 h-screen flex flex-col">
      <div className="w-full h-[15vh]">{/* Potential Logo */}</div>
      <div className="w-full">
        {paths.map((path, index) => {
          if (
            (path.roles && path.roles.includes(user.staffRole)) ||
            !path.roles
          ) {
            return (
              <div key={index}>
                <Link
                  to={path.path}
                  className="inline-flex w-full items-center h-10 2xl:h-12"
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
                  <span className="ml-4 2xl:ml-8 2xl:text-xl">
                    {path.label}
                  </span>
                </Link>
                <div key={index} className="w-4/5 h-[2px] bg-gray-900 mx-auto">
                  &nbsp;
                </div>
              </div>
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
      <div className="w-full px-2 mt-auto mb-20 items-center mx-auto inline-flex">
        <img src="/images/AvatarFill.png" className="w-8 h-8" />
        <div className="flex flex-col ml-2 2x:ml-4">
          <span className="2xl:text-lg">{user.username}</span>
          <span className="text-sm 2xl:text-base text-gray-500">
            {user.staffRole}
          </span>
        </div>
        <Menu as="div" className="relative ml-2">
          <Menu.Button>
            <MoreHorizontalOutline size="24" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              as="div"
              className="z-50 bottom-8 2xl:bottom-14 origin-top-right absolute left-0 bg-gray-50 rounded-lg shadow-lg p-1 flex flex-col min-w-fit"
            >
              <Menu.Item>
                <Link
                  to="/profile"
                  className="text-sm 2xl:text-base hover:bg-gray-300 rounded-lg px-4 py-1 transition-colors hover:text-gray-700"
                >
                  Profile
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  to="/profile/password"
                  className="text-sm 2xl:text-base hover:bg-gray-300 rounded-lg px-4 py-1 transition-colors hover:text-gray-700 whitespace-nowrap"
                >
                  Change Password
                </Link>
              </Menu.Item>
              <Menu.Item>
                <button
                  onClick={handleLogout}
                  className="text-sm 2xl:text-base hover:bg-gray-300 rounded-lg px-4 py-1 transition-colors hover:text-gray-700 text-left"
                >
                  Logout
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
};

export default NavBar;
