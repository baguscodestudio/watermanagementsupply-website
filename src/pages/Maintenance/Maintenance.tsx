import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Plus } from '@styled-icons/boxicons-regular/Plus';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Pagination from '../../components/Pagination';
import Paper from '../../components/Paper';

import EquipmentType from '../../type/Equipment';
import MaintenanceType from '../../type/Maintenance';

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState<MaintenanceType[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchMt, setMtSearch] = useState('');
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [selEquipment, setSelEquipment] = useState('');
  const navigate = useNavigate();

  const handleSelectEquipment = (id: string) => {
    if (id === selEquipment) {
      setSelEquipment('');
      fetchMaintenances();
    } else {
      setSelEquipment(id);
      filterByEquipment(id);
    }
  };

  const handleMaintenanceSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchMt !== '') {
      axios
        .get('http://localhost:5000/api/Maintenance/Search', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: searchMt,
          },
        })
        .then((response) => setMaintenances(response.data.result))
        .catch((err) => {
          console.log(err);
          toast.error(
            'An error occured while searching for maintenance records'
          );
        });
    } else fetchMaintenances();
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search !== '') {
      axios
        .get('http://localhost:5000/api/Equipment/Search', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: search,
          },
        })
        .then((response) => {
          setEquipments(response.data.result);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error occured while getting equipments');
        });
    } else fetchEquipments();
  };

  const filterByEquipment = (id: string) => {
    axios
      .get(`http://localhost:5000/api/Maintenance/Equipment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setMaintenances(response.data.result))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while filtering by equipment');
      });
  };

  const fetchEquipments = () => {
    axios
      .get('http://localhost:5000/api/Equipment', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setEquipments(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting equipments');
      });
  };

  const fetchMaintenances = () => {
    axios
      .get('http://localhost:5000/api/Maintenance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setMaintenances(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting maintenance');
      });
  };

  useEffect(() => {
    fetchEquipments();
    fetchMaintenances();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Link
          to="/maintenance/create"
          className="absolute bottom-20 right-10 rounded-full w-12 h-12 text-white bg-green-500 hover:scale-105 hover:rotate-180 transition-all flex"
        >
          <Plus size="32" className="m-auto" />
        </Link>
        <Header title="Maintenance List" />
        <div className="flex py-10 px-12 h-[90vh] items-center">
          <div className="h-full w-1/5 rounded-lg shadow-xl p-4 flex flex-col">
            <form
              onSubmit={(event) => handleSearch(event)}
              className="rounded-lg ring-1 ring-gray-500 w-full h-8 my-4 inline-flex items-center px-2"
            >
              <button
                type="submit"
                className="mr-4 hover:bg-gray-500 hover:text-white rounded-full w-6 h-6 flex transition-colors"
              >
                <Search size="16" className="m-auto" />
              </button>
              <input
                placeholder="Search Equipment"
                onChange={(event) => setSearch(event.currentTarget.value)}
                id="search"
                className="outline-none w-full"
              />
            </form>
            <span className="px-4 text-lg font-semibold">Equipments</span>
            <div className="w-full h-[2px] bg-gray-900 my-2" />
            <table className="w-full text-center">
              <tbody>
                {equipments
                  .slice(page * 15, page * 15 + 15)
                  .map((eq, index) => (
                    <tr
                      key={index}
                      onClick={() => handleSelectEquipment(eq.equipmentId)}
                      className="border-b-2 h-8 border-gray-200 last-of-type:border-none hover:cursor-pointer"
                    >
                      <td className="py-1">
                        <div
                          className={`${
                            selEquipment.includes(eq.equipmentId) &&
                            'bg-gray-200 text-gray-500 rounded-lg'
                          }`}
                        >
                          {eq.equipmentName}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Pagination
              className="mt-auto mx-auto mb-6"
              rows={equipments.length}
              rowsPerPage={15}
              page={page}
              setPage={setPage}
            />
          </div>
          <div className="w-4/5 flex flex-col pl-4 h-full">
            <form
              onSubmit={(event) => handleMaintenanceSearch(event)}
              className="rounded-lg ring-1 ring-gray-500 w-full h-12 my-8 inline-flex items-center px-6"
            >
              <button type="submit" className="mr-4">
                <Search size="24" />
              </button>
              <input
                placeholder="Search for maintenance"
                onChange={(event) => setMtSearch(event.currentTarget.value)}
                id="search"
                className="outline-none text-lg w-full"
              />
            </form>
            <Paper className="w-full h-4/5 flex flex-col">
              <table>
                <thead>
                  <tr className="text-sm text-gray-500 border-b-2 border-gray-200 h-10">
                    <th className="font-normal px-4 text-left w-2/12">
                      Equipment
                    </th>
                    <th className="font-normal px-4 w-2/12">Date</th>
                    <th className="font-normal px-4 w-6/12">Summary</th>
                    <th className="font-normal px-4 w-2/12">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenances
                    .slice(page * 9, page * 9 + 9)
                    .map((mt, index) => (
                      <tr
                        key={index}
                        onClick={() =>
                          navigate(`/maintenance/${mt.maintenanceId}`)
                        }
                        className="h-12 border-b-2 border-gray-200 hover:text-gray-500 hover:cursor-pointer group border-collapse"
                      >
                        <td className="">
                          <div className="px-4 py-2 group-hover:bg-gray-200 rounded-l-lg">
                            {
                              equipments.find(
                                (eq) => eq.equipmentId === mt.equipmentId
                              )?.equipmentName
                            }
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="px-4 py-2 group-hover:bg-gray-200">
                            {moment(mt.date).format('DD-MM-YYYY')}
                          </div>
                        </td>
                        <td className="">
                          <div className="px-4 py-2 group-hover:bg-gray-200">
                            {mt.summary}
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="px-4 py-2 group-hover:bg-gray-200 rounded-r-lg">
                            ${mt.cost}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination
                className="ml-auto mt-auto mb-8 inline-flex items-center"
                rows={maintenances.length}
                rowsPerPage={10}
                page={page}
                setPage={setPage}
              />
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
