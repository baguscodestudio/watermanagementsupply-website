import { Menu } from '@headlessui/react';
import moment from 'moment';
import { NotificationContext } from '../App';
import { Fragment, useContext } from 'react';

import { Bell } from 'styled-icons/bootstrap';
import { InfoOutline } from '@styled-icons/evaicons-outline/InfoOutline';
import { Link } from 'react-router-dom';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { notifications } = useContext(NotificationContext);
  return (
    <header className="w-full h-[10vh] shadow-lg inline-flex items-center bg-white">
      <span className="ml-12 text-xl 2xl:text-3xl font-semibold">{title}</span>
      <Menu as="div" className="relative ml-auto mr-12">
        <Menu.Button as={Fragment}>
          <Bell
            size="24"
            className="hover:cursor-pointer hover:text-amber-400 transition-colors"
          />
        </Menu.Button>
        <Menu.Items
          as="div"
          className="absolute origin-top-right right-0 bg-gray-50 shadow-lg p-2 rounded-lg flex flex-col"
        >
          {notifications.slice(0, 4).map((notification, index) => (
            <Menu.Item key={index}>
              <div
                className={`inline-flex items-center p-1 rounded-lg w-[20vw] my-1 ${
                  notification.isRead && 'bg-gray-100 text-gray-500'
                }`}
                key={index}
              >
                <div className="flex flex-col">
                  <div className="inline-flex items-end">
                    <span className="font-semibold text-sm 2xl:text-base">
                      {notification.type}
                    </span>
                    <span className="text-gray-500 ml-2 font-light text-xs 2xl:text-sm">
                      {moment(notification.createdAt).format(
                        'HH:mm:ss DD/MM/YYYY'
                      )}
                    </span>
                  </div>
                  <span className="text-xs 2xl:text-sm">
                    {notification.content}
                  </span>
                </div>
                <InfoOutline size="48" />
              </div>
            </Menu.Item>
          ))}
          <Link
            to="/notifications"
            className="2xl:text-sm ml-auto mr-8 2xl:mr-12 mb-2 mt-auto text-gray-500 hover:text-gray-800 transition-colors text-xs"
          >
            View More
          </Link>
        </Menu.Items>
      </Menu>
    </header>
  );
};

export default Header;
