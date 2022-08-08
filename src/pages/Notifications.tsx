import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { NotificationContext, UserContext } from '../App';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Paper from '../components/Paper';
import { InfoOutline } from '@styled-icons/evaicons-outline/InfoOutline';
import Pagination from '../components/Pagination';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Popover } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { notifications, setNotifications } = useContext(NotificationContext);
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(1);
  const navigate = useNavigate();

  const fetchNotifications = () => {
    axios
      .get('http://localhost:5000/api/Notification', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          page: page + 1,
          pageSize: 8,
        },
      })
      .then((response) => {
        setLength(response.data.metadata.count);
        setNotifications(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching notifications');
      });
  };

  useEffect(() => {
    if (user.staffRole === 'Technician') {
      fetchNotifications();
    } else {
      toast.error('You do not have access to notifications!');
      navigate('/dashboard');
    }
  }, [page]);

  const handleRead = (read: boolean, id: string) => {
    axios
      .put(
        `http://localhost:5000/api/Notification/${id}/${read}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        fetchNotifications();
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while updating notification status');
      });
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:5000/api/Notification/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        toast('Successfully deleted notification!');
        fetchNotifications();
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while deleting notification');
      });
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Notifications" />
        <div className="flex flex-col py-10 px-12 h-[90vh]">
          <Paper className="col-span-4 px-6 py-4 flex flex-col">
            <span className="font-semibold text-xl mb-4">Notifications</span>
            {notifications.map((notification, index) => (
              <Popover className="relative w-full my-2">
                <Popover.Button
                  className={`inline-flex items-center p-1 rounded-lg ${
                    notification.isRead && 'bg-gray-100 text-gray-500'
                  }`}
                  key={index}
                >
                  <div className="flex flex-col">
                    <div className="inline-flex items-end">
                      <span className="font-semibold">{notification.type}</span>
                      <span className="text-gray-500 text-sm ml-2 font-light">
                        {moment(notification.createdAt).format(
                          'HH:mm:ss DD/MM/YYYY'
                        )}
                      </span>
                    </div>
                    <span className="text-sm">{notification.content}</span>
                  </div>
                  <InfoOutline size="48" className="ml-auto" />
                </Popover.Button>
                <Popover.Panel className="absolute z-10">
                  <Paper className="flex flex-col items-start px-4 py-2">
                    <button
                      className="px-4 py-1 rounded-lg hover:bg-gray-500 hover:text-white"
                      onClick={() =>
                        handleRead(true, notification.notificationId)
                      }
                    >
                      Mark as Read
                    </button>
                    <button
                      className="px-4 py-1 rounded-lg hover:bg-gray-500 hover:text-white"
                      onClick={() =>
                        handleRead(false, notification.notificationId)
                      }
                    >
                      Mark as Unread
                    </button>
                    <button
                      className="px-4 py-1 rounded-lg hover:bg-red-500 hover:text-white"
                      onClick={() => handleDelete(notification.notificationId)}
                    >
                      Delete
                    </button>
                  </Paper>
                </Popover.Panel>
              </Popover>
            ))}
          </Paper>
          <Pagination
            className="ml-auto mt-6"
            rows={length}
            rowsPerPage={8}
            setPage={setPage}
            page={page}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
