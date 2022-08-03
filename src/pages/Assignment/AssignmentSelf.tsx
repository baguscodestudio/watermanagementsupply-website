import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import moment from 'moment';

import Header from '../../components/Header';
import Pagination from '../../components/Pagination';
import NavBar from '../../components/NavBar';
import Paper from '../../components/Paper';
import SelectLabel from '../../components/SelectLabel';

import CustomerType from '../../type/Customer';
import EquipmentType from '../../type/Equipment';
import UserType from '../../type/User';
import AssignmentType from '../../type/Assignment';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Plus } from '@styled-icons/boxicons-regular/Plus';

const FILTERS = ['Staff', 'Customer', 'Equipment'];

const AssignmentSelf = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [staffs, setStaffs] = useState<UserType[]>([]);
  const [sel, setSel] = useState<string[]>([]);
  const [selEq, setSelEq] = useState<string[]>([]);
  const [selCust, setSelCust] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [pageCust, setPageCust] = useState(0);
  const [pageEq, setPageEq] = useState(0);
  const [search, setSearch] = useState('');
  const [searchCust, setSearchCust] = useState('');
  const [searchEq, setSearchEq] = useState('');
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const { user } = useContext(UserContext);
  const [filter, setFilter] = useState(FILTERS[0]);
  const navigate = useNavigate();

  const fetchAssignments = () => {
    axios
      .get('http://localhost:5000/api/TaskAssignment/Staff/MyInfo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setAssignments(response.data.result))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching assignments');
      });
  };

  const addSelected = (staff: UserType) => {
    if (sel.includes(staff.userId)) {
      let tempArr = [...sel];
      tempArr = tempArr.filter((id) => id !== staff.userId);
      setSel(tempArr);
    } else if (sel.length < 5) {
      let tempArr = [...sel];
      tempArr.push(staff.userId);
      setSel(tempArr);
    } else {
      let tempArr = [...sel];
      tempArr.shift();
      tempArr.push(staff.userId);
      setSel(tempArr);
    }
  };

  const addSelectedEquipment = (eq: EquipmentType) => {
    if (selEq.includes(eq.equipmentId)) {
      let tempArr = [...selEq];
      tempArr = tempArr.filter((id) => id !== eq.equipmentId);
      setSelEq(tempArr);
    } else if (selEq.length < 5) {
      let tempArr = [...selEq];
      tempArr.push(eq.equipmentId);
      setSelEq(tempArr);
    } else {
      let tempArr = [...selEq];
      tempArr.shift();
      tempArr.push(eq.equipmentId);
      setSelEq(tempArr);
    }
  };

  const addSelectedCustomer = (cust: CustomerType) => {
    if (selCust.includes(cust.userId)) {
      let tempArr = [...selCust];
      tempArr = tempArr.filter((id) => id !== cust.userId);
      setSelCust(tempArr);
    } else if (selCust.length < 5) {
      let tempArr = [...selCust];
      tempArr.push(cust.userId);
      setSelCust(tempArr);
    } else {
      let tempArr = [...selCust];
      tempArr.shift();
      tempArr.push(cust.userId);
      setSelCust(tempArr);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search !== '') {
      axios
        .get('http://localhost:5000/api/Staff/Search', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: search,
          },
        })
        .then((response) => setStaffs(response.data.result))
        .catch((err) => {
          console.log(err);
          toast.error('An error occured while fetching staffs');
        });
    } else fetchStaffs();
  };

  const fetchStaffs = () => {
    axios
      .get('http://localhost:5000/api/Staff', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setStaffs(response.data.result))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching staffs');
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
        toast.error('An error occured while getting equipments');
      });
  };

  const handleSearchCust = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchCust !== '') {
      axios
        .get('http://localhost:5000/api/Customer/Search', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: searchCust,
          },
        })
        .then((response) => {
          setCustomers(response.data.result);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error occured while searching for customers');
        });
    } else fetchCustomers();
  };

  const fetchCustomers = () => {
    axios
      .get('http://localhost:5000/api/Customer', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setCustomers(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting customers');
      });
  };

  const handleSearchEq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user.staffRole === 'Technician') {
      if (searchEq !== '') {
        axios
          .get('http://localhost:5000/api/Equipment/Search', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            params: {
              keyword: searchEq,
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
    }
  };

  const renderFilter = () => {
    if (filter === 'Staff') {
      return (
        <div className="w-full h-5/6 rounded-lg shadow-xl p-4 flex flex-col">
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
              placeholder="Staff name"
              onChange={(event) => setSearch(event.currentTarget.value)}
              id="search"
              className="outline-none w-full"
            />
          </form>
          <span className="px-4 text-lg font-semibold">Staffs</span>
          <div className="w-full h-[2px] bg-gray-900 my-2" />
          <table className="w-full text-center">
            <tbody>
              {staffs.slice(page * 10, page * 10 + 10).map((staff, index) => (
                <tr
                  key={index}
                  onClick={() => addSelected(staff)}
                  className="border-b-2 h-8 border-gray-200 last-of-type:border-none hover:cursor-pointer"
                >
                  <td className="py-1">
                    <div
                      className={`${
                        sel.includes(staff.userId) &&
                        'bg-gray-200 text-gray-500 rounded-lg'
                      }`}
                    >
                      {staff.username}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            className="mt-auto mx-auto mb-4"
            rows={staffs.length}
            rowsPerPage={10}
            page={page}
            setPage={setPage}
          />
        </div>
      );
    } else if (filter === 'Customer') {
      return (
        <div className="w-full h-5/6 rounded-lg shadow-xl p-4 flex flex-col">
          <form
            onSubmit={(event) => handleSearchCust(event)}
            className="rounded-lg ring-1 ring-gray-500 w-full h-8 my-4 inline-flex items-center px-2"
          >
            <button
              type="submit"
              className="mr-4 hover:bg-gray-500 hover:text-white rounded-full w-6 h-6 flex transition-colors"
            >
              <Search size="16" className="m-auto" />
            </button>
            <input
              placeholder="Customer name"
              onChange={(event) => setSearchCust(event.currentTarget.value)}
              id="search"
              className="outline-none w-full"
            />
          </form>
          <span className="px-4 text-lg font-semibold">Customers</span>
          <div className="w-full h-[2px] bg-gray-900 my-2" />
          <table className="w-full text-center">
            <tbody>
              {customers
                .slice(page * 10, page * 10 + 10)
                .map((customer, index) => (
                  <tr
                    key={index}
                    onClick={() => addSelectedCustomer(customer)}
                    className="border-b-2 h-8 border-gray-200 last-of-type:border-none hover:cursor-pointer"
                  >
                    <td className="py-1">
                      <div
                        className={`${
                          selCust.includes(customer.userId) &&
                          'bg-gray-200 text-gray-500 rounded-lg'
                        }`}
                      >
                        {customer.username}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            className="mt-auto mx-auto mb-4"
            rows={customers.length}
            rowsPerPage={10}
            page={pageCust}
            setPage={setPageCust}
          />
        </div>
      );
    } else if (filter === 'Equipment') {
      return (
        <div className="w-full h-5/6 rounded-lg shadow-xl p-4 flex flex-col">
          <form
            onSubmit={(event) => handleSearchEq(event)}
            className="rounded-lg ring-1 ring-gray-500 w-full h-8 my-4 inline-flex items-center px-2"
          >
            <button
              type="submit"
              className="mr-4 hover:bg-gray-500 hover:text-white rounded-full w-6 h-6 flex transition-colors"
            >
              <Search size="16" className="m-auto" />
            </button>
            <input
              placeholder="Search for equipment name"
              onChange={(event) => setSearchEq(event.currentTarget.value)}
              id="search"
              className="outline-none w-full"
            />
          </form>
          <span className="px-4 text-lg font-semibold">Equipments</span>
          <div className="w-full h-[2px] bg-gray-900 my-2" />
          <table className="w-full text-center">
            <tbody>
              {equipments
                .slice(pageEq * 10, pageEq * 10 + 10)
                .map((equipment, index) => (
                  <tr
                    key={index}
                    onClick={() => addSelectedEquipment(equipment)}
                    className="border-b-2 h-8 border-gray-200 last-of-type:border-none hover:cursor-pointer"
                  >
                    <td className="py-1">
                      <div
                        className={`${
                          selEq.includes(equipment.equipmentId) &&
                          'bg-gray-200 text-gray-500 rounded-lg'
                        }`}
                      >
                        {equipment.equipmentName}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            className="mt-auto mx-auto mb-6"
            rows={equipments.length}
            rowsPerPage={10}
            page={pageEq}
            setPage={setPageEq}
          />
        </div>
      );
    }
  };

  useEffect(() => {
    setSel([]);
    setSelCust([]);
    setSelEq([]);
  }, [filter]);

  useEffect(() => {
    fetchAssignments();
    fetchStaffs();
    fetchEquipments();
    fetchCustomers();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Link
          to="/assignment/create"
          className="absolute bottom-20 right-10 rounded-full w-12 h-12 text-white bg-green-500 hover:scale-105 hover:rotate-180 transition-all flex"
        >
          <Plus size="32" className="m-auto" />
        </Link>
        <Header title="Assignment List" />
        <div className="w-full flex py-10 px-12 h-[90vh]">
          <div className="h-full w-1/5">
            {renderFilter()}
            <Paper className="my-4 px-4 py-2">
              <SelectLabel
                list={FILTERS}
                onChange={setFilter}
                title="Filter By"
                value={filter}
              />
            </Paper>
          </div>
          <div className="w-4/5 flex flex-col pl-4 h-full">
            <Paper className="w-full h-4/5 flex flex-col">
              <table>
                <thead>
                  <tr className="text-sm text-gray-500 border-b-2 border-gray-200 h-10">
                    <th className="font-normal px-4 text-left w-2/12">
                      Task Name
                    </th>
                    <th className="font-normal px-4 w-2/12">Staff Assigned</th>
                    <th className="font-normal px-4 w-1/12">Customer</th>
                    <th className="font-normal px-4 w-1/12">Equipment</th>
                    <th className="font-normal px-4 w-2/12">Deadline</th>
                    <th className="font-normal px-4 w-2/12">Finished</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments
                    .slice(page * 9, page * 9 + 9)
                    .map((assignment, index) => {
                      if (
                        (selCust.length === 0 ||
                          selCust.includes(assignment.customerId)) &&
                        (selEq.length === 0 ||
                          selEq.includes(assignment.equipmentId)) &&
                        (sel.length === 0 || sel.includes(assignment.staffId))
                      ) {
                        return (
                          <tr
                            key={index}
                            onClick={() =>
                              navigate(`/assignment/${assignment.taskId}`)
                            }
                            className="h-12 border-b-2 border-gray-200 hover:text-gray-500 hover:cursor-pointer group border-collapse"
                          >
                            <td className="">
                              <div className="px-4 py-2 group-hover:bg-gray-200 rounded-l-lg truncate">
                                {assignment.taskName}
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="px-4 py-2 group-hover:bg-gray-200">
                                {
                                  staffs.find(
                                    (staff) =>
                                      staff.userId === assignment.staffId
                                  )?.username
                                }
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="px-4 py-2 group-hover:bg-gray-200">
                                {assignment.equipmentId &&
                                  equipments.find(
                                    (eq) =>
                                      eq.equipmentId === assignment.equipmentId
                                  )?.equipmentName}
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="px-4 py-2 group-hover:bg-gray-200">
                                {assignment.customerId &&
                                  customers.find(
                                    (customer) =>
                                      customer.userId === assignment.customerId
                                  )?.username}
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="px-4 py-2 group-hover:bg-gray-200">
                                {assignment.deadline &&
                                  moment(assignment.deadline).format(
                                    'hh:mm:ss A DD/MM/YYYY'
                                  )}
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="px-4 py-2 group-hover:bg-gray-200">
                                {assignment.finishedAt &&
                                  moment(assignment.finishedAt).format(
                                    'hh:mm:ss A DD/MM/YYYY'
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
              <Pagination
                className="ml-auto mt-auto mb-8 inline-flex items-center"
                rows={assignments.length}
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

export default AssignmentSelf;
