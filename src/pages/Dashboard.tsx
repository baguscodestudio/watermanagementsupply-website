import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';

import { InfoOutline } from '@styled-icons/evaicons-outline/InfoOutline';
import { CircleFill } from '@styled-icons/bootstrap/CircleFill';
import { Warning } from '@styled-icons/fluentui-system-regular/Warning';

import { NotificationContext, UserContext } from '../App';
import PumpScheduleType from '../type/PumpSchedule';

import NavBar from '../components/NavBar';
import Paper from '../components/Paper';
import Header from '../components/Header';

import ChemicalType from '../type/Chemical';
import EquipmentType from '../type/Equipment';
import { formatter } from '../utils';

const Dashboard = () => {
  const [chemicals, setChemicals] = useState<ChemicalType[]>([]);
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [pumpSchedule, setPumpSchedule] = useState<PumpScheduleType[]>([]);
  const { notifications } = useContext(NotificationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user.staffRole === 'Technician') {
      axios
        .get(`${import.meta.env.VITE_REST_URL}/Chemical/BelowMinQuantity`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            page: 1,
            pageSize: 100,
          },
        })
        .then((response) => {
          setChemicals(response.data.result);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error while fetching chemicals');
        });
      axios
        .get(`${import.meta.env.VITE_REST_URL}/PumpSchedule`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((response) => setPumpSchedule(response.data.result))
        .catch((err) => {
          console.log(err);
          toast.error('Error while creating');
        });
      axios
        .get(`${import.meta.env.VITE_REST_URL}/Equipment`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            page: 1,
            pageSize: 100,
          },
        })
        .then((response) => {
          setEquipments(response.data.result);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error while fetching equipments');
        });
    }
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full bg-gray-50">
        <Header title={`Welcome, ${user.username}`} />
        <div className="grid grid-cols-12 grid-rows-2 h-[90vh] w-full p-12 gap-8">
          {user.staffRole === 'Technician' && (
            <Paper className="col-span-8 px-6 py-4 flex flex-col">
              <span className="text-lg font-semibold">Chemical Status</span>
              <span className="text-sm text-gray-500">
                Chemicals under minimum quantity
              </span>
              <table className="mt-2 border-separate border-spacing-y-2">
                <thead className="rounded-lg overflow-clip">
                  <tr className="bg-gray-200 h-6 2xl:h-8">
                    <th className="font-semibold">Name</th>
                    <th className="font-semibold">Min Quantity</th>
                    <th className="font-semibold">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {chemicals
                    .sort((a, b) => a.quantity - b.quantity)
                    .slice(0, 4)
                    .map((chemical, index) => (
                      <tr className="h-5 2xl:h-6 text-xs 2xl:text-sm">
                        <td className="text-center">{chemical.chemicalName}</td>
                        <td className="text-center border-x-2">{`${chemical.minQuantity}`}</td>
                        <td className="text-center relative">
                          {`${formatter.format(chemical.quantity)}`}
                          {chemical.minQuantity > chemical.quantity && (
                            <Warning size="24" className="absolute right-8" />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Link
                to="/chemical"
                className="text-xs 2xl:text-base ml-auto mr-8 2xl:mr-12 mb-2 mt-auto text-gray-500 hover:text-gray-800 transition-colors"
              >
                View More
              </Link>
            </Paper>
          )}
          {user.staffRole === 'Technician' && (
            <>
              <Paper className="col-span-4 row-span-2 px-6 py-4 flex flex-col">
                <span className="font-semibold text-xl mb-4">
                  Notifications
                </span>
                {notifications.slice(0, 3).map((notification, index) => (
                  <div
                    className={`inline-flex items-center p-1 rounded-lg ${
                      notification.isRead && 'bg-gray-100 text-gray-500'
                    }`}
                    key={index}
                  >
                    <div className="flex flex-col">
                      <div className="inline-flex items-end">
                        <span className="font-semibold text-sm 2xl:text-base">
                          {notification.type}
                        </span>
                        <span className="text-gray-500 text-xs 2xl:text-sm ml-2 font-light">
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
                ))}
                <Link
                  to="/notifications"
                  className="text-xs 2xl:text-base ml-auto mr-4 mb-2 mt-auto text-gray-500 hover:text-gray-800 transition-colors"
                >
                  View More
                </Link>
              </Paper>
              <Paper className="col-span-8 px-6 py-4 flex flex-col">
                <span className="text-lg font-semibold">Equipment Status</span>
                <span className="text-sm text-gray-500">
                  Current scheduled equipments to run
                </span>
                <table>
                  <thead>
                    <tr className="border-b-2 border-gray-200 h-6 text-sm 2xl:text-base 2xl:h-10">
                      <th className="font-normal text-gray-500">Name</th>
                      <th className="font-normal text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipments.slice(0, 4).map((equipment, index) => (
                      <tr
                        className="border-b-2 border-gray-200 h-6 2xl:text-sm text-xs 2xl:h-8"
                        key={index}
                      >
                        <td className="px-8">{equipment.equipmentName}</td>
                        <td className="text-center">
                          {equipment.isActive ? (
                            <>
                              <CircleFill
                                size="20"
                                className="text-green-500 mr-2"
                              />
                              Running
                            </>
                          ) : (
                            <>
                              <CircleFill
                                size="20"
                                className="text-red-500 mr-2"
                              />
                              Inactive
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
