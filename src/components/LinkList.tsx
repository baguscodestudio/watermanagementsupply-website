import { Menu, Transition } from '@headlessui/react';
import React, { useContext, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ChevronDown } from '@styled-icons/fluentui-system-regular/ChevronDown';
import { UserContext } from '../App';

interface LinkType {
  title: string;
  icon: JSX.Element;
  roles: string[];
  items: {
    roles: string[];
    label: string;
    path: string;
  }[];
}

const LinkList: React.FC<LinkType> = ({ title, icon, roles, items }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const checkSublink = () => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].path === location.pathname) {
        console.log('iya sama nih');
        return true;
      }
    }
    return false;
  };

  if (roles.includes(user.staffRole))
    return (
      <>
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button className="inline-flex w-full items-center h-12">
                {checkSublink() ? (
                  <div className="rounded-r-md h-full w-[6px] bg-gray-900">
                    &nbsp;
                  </div>
                ) : (
                  <div className="rounded-r-md h-full w-[6px] bg-transparent">
                    &nbsp;
                  </div>
                )}
                {icon}
                <span className="ml-8 text-xl">{title}</span>
                <ChevronDown size="24" className="ml-auto mr-8" />
              </Menu.Button>
              <Transition
                show={checkSublink() ? true : open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static={checkSublink()}
                  className="w-4/5 mx-auto flex flex-col"
                >
                  {items.map((item, index) => {
                    if (item.roles.includes(user.staffRole))
                      return (
                        <Menu.Item key={index}>
                          <Link to={item.path} className="text-lg ml-8 h-10">
                            {item.label}
                          </Link>
                        </Menu.Item>
                      );
                  })}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
        <div className="w-4/5 h-[2px] bg-gray-900 mx-auto">&nbsp;</div>
      </>
    );
  else return null;
};

export default LinkList;
