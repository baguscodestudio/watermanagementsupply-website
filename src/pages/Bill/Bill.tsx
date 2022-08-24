import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatter } from '../../utils';

import { Search } from '@styled-icons/boxicons-regular/Search';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Pagination from '../../components/Pagination';
import Paper from '../../components/Paper';
import InputLabel from '../../components/InputLabel';

import BillType from '../../type/Bill';
import CustomerType from '../../type/Customer';

const Bill = () => {
  const [bills, setBills] = useState<BillType[]>([]);
  const [page, setPage] = useState(0);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [selCustomer, setSelCustomer] = useState<string>('');
  const [bill, setBill] = useState({
    title: '',
    deadline: '',
    month: moment().month(),
    year: moment().year(),
  });
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search !== '') {
      axios
        .get(`${import.meta.env.VITE_REST_URL}/Customer/Search`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: search,
          },
        })
        .then((response) => setCustomers(response.data.result))
        .catch((err) => {
          console.log(err);
          toast.error('An error occured while fetching customers');
        });
    } else fetchCustomers();
  };

  const fetchCustomers = () => {
    axios
      .get(`${import.meta.env.VITE_REST_URL}/Customer`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setCustomers(response.data.result))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching customers');
      });
  };

  const fetchBills = () => {
    axios
      .get(`${import.meta.env.VITE_REST_URL}/Bill`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setBills(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occurred while fetching bills');
      });
  };

  useEffect(() => {
    fetchCustomers();
    fetchBills();
  }, []);

  const handleSelectCustomer = (id: string) => {
    if (selCustomer == id) {
      setSelCustomer('');
      fetchBills();
    } else {
      setSelCustomer(id);
      axios
        .get(`${import.meta.env.VITE_REST_URL}/Bill`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            customerId: id,
          },
        })
        .then((response) => {
          setBills(response.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error('An error occurred while fetching bills');
        });
    }
  };

  const getCustomerName = (id: string) => {
    if (customers) {
      for (let i = 0; i < customers.length; i++) {
        if (customers[i].userId === id) {
          return customers[i].username;
        }
      }
    } else return id;
  };

  const billCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_REST_URL}/Bill`,
        {
          ...bill,
          deadline: moment(bill.deadline),
          customerId: selCustomer,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast(
          `Successfully generated bill for customer ${getCustomerName(
            selCustomer
          )}`
        );
        axios
          .get(`${import.meta.env.VITE_REST_URL}/Bill`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            params: {
              customerId: selCustomer,
            },
          })
          .then((response) => {
            setBills(response.data);
          })
          .catch((err) => {
            console.log(err);
            toast.error('An error occurred while fetching bills');
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while generating bill for customer');
      });
  };

  const generateBill = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_REST_URL}/Bill/GenerateBills`,
        {
          month: month,
          year: year,
          deadline: moment().add(1, 'month'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast(
          `Successfully generated bills for every customer for ${moment().format(
            'MMMM'
          )}`
        );
        fetchBills();
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while generating bills');
      });
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-full">
        <Header title="Bills" />
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
                placeholder="Search Customer"
                onChange={(event) => setSearch(event.currentTarget.value)}
                id="search"
                className="outline-none w-full"
              />
            </form>
            <span className="px-4 text-lg font-semibold">Customers</span>
            <div className="w-full h-[2px] bg-gray-900 my-2" />
            <table className="w-full text-center">
              <tbody>
                {customers
                  .slice(page * 15, page * 15 + 15)
                  .map((customer, index) => (
                    <tr
                      key={index}
                      onClick={() => handleSelectCustomer(customer.userId)}
                      className="border-b-2 h-8 border-gray-200 last-of-type:border-none hover:cursor-pointer"
                    >
                      <td className="py-1">
                        <div
                          className={`${
                            selCustomer.includes(customer.userId) &&
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
              className="mt-auto mx-auto mb-6"
              rows={customers.length}
              rowsPerPage={15}
              page={page}
              setPage={setPage}
            />
          </div>
          <div className="w-4/5 flex flex-col pl-4 h-full">
            <Paper className="w-full h-4/5 flex flex-col">
              <table>
                <thead>
                  <tr className="text-sm text-gray-500 border-b-2 border-gray-200 h-10">
                    <th className="font-normal px-4 text-left w-2/12">
                      Customer
                    </th>
                    <th className="font-normal px-4 w-1/12">Month</th>
                    <th className="font-normal px-4 w-1/12">Year</th>
                    <th className="font-normal px-4 w-1/12">Rate</th>
                    <th className="font-normal px-4 w-1/12">Amount</th>
                    <th className="font-normal px-4 w-2/12">Title</th>
                    <th className="font-normal px-4 w-2/12">Created at</th>
                    <th className="font-normal px-4 w-2/12">Deadline</th>
                    <th className="font-normal px-4 w-2/12">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.slice(page * 9, page * 9 + 9).map((bill, index) => (
                    <tr
                      key={index}
                      onClick={() => navigate(`/bill/${bill.billId}`)}
                      className="h-12 border-b-2 border-gray-200 hover:text-gray-500 hover:cursor-pointer group border-collapse"
                    >
                      <td className="">
                        <div className="px-4 py-2 group-hover:bg-gray-200 rounded-l-lg">
                          {getCustomerName(bill.customerId)}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="px-4 py-2 group-hover:bg-gray-200">
                          {bill.month}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="px-4 py-2 group-hover:bg-gray-200">
                          {bill.year}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="px-4 py-2 group-hover:bg-gray-200">
                          ${bill.rate}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="px-4 py-2 group-hover:bg-gray-200">
                          $
                          {formatter.format(
                            (bill.totalUsage * bill.rate) / 1000
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="px-4 py-2 group-hover:bg-gray-200">
                          {bill.title}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="px-4 py-2 group-hover:bg-gray-200">
                          {moment(bill.createdAt).format('DD/MM/YYYY')}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="px-4 py-2 group-hover:bg-gray-200">
                          {moment(bill.deadline).format('DD/MM/YYYY')}
                        </div>
                      </td>

                      <td className="">
                        <div className="px-4 py-1 group-hover:bg-gray-200 rounded-r-lg">
                          <div
                            className={`px-4 py-1 text-white flex justify-center rounded-lg ${
                              bill.payment ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          >
                            {bill.payment ? 'Paid' : 'Unpaid'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                className="ml-auto mt-auto mb-8 inline-flex items-center"
                rows={bills.length}
                rowsPerPage={10}
                page={page}
                setPage={setPage}
              />
            </Paper>
            <Paper className="mt-auto w-full inline-flex h-1/5 px-4 py-2 items-start">
              <form onSubmit={generateBill} className="mx-4 flex w-1/3">
                <div className="flex flex-col w-1/2 px-2">
                  <InputLabel
                    label="Month"
                    required={true}
                    onChange={(event) => {
                      setMonth(parseInt(event.currentTarget.value));
                    }}
                  />
                  <InputLabel
                    className="mt-2"
                    label="Year"
                    required={true}
                    onChange={(event) => {
                      setYear(parseInt(event.currentTarget.value));
                    }}
                  />
                </div>
                <div className="flex flex-col w-1/2 px-2">
                  <span className="mb-4 font-semibold text-sm">
                    Generate Bills for every customer for{' '}
                    {month !== 0 &&
                      year !== 0 &&
                      moment(`${month}/${year}`, 'M/YYYY').format('MMMM')}
                  </span>
                  <button
                    type="submit"
                    className="ring-offset-2 ring-blue-800 ring-2 bg-blue-600 text-white rounded-lg px-4 py-1 hover:bg-blue-200 hover:text-black"
                  >
                    Generate Bills
                  </button>
                </div>
              </form>
              {selCustomer && (
                <form className="flex h-full mx-4" onSubmit={billCustomer}>
                  <div className="flex flex-col h-full mr-4">
                    <span className="font-semibold mb-4 text-sm">
                      {getCustomerName(selCustomer)}
                    </span>
                    <button
                      className="px-2 py-1 bg-sky-500 rounded-lg text-white"
                      type="submit"
                    >
                      Create Bill
                    </button>
                  </div>
                  <div className="mx-4 h-full flex flex-col">
                    <InputLabel
                      label="Title"
                      required={true}
                      onChange={(event) =>
                        setBill({ ...bill, title: event.currentTarget.value })
                      }
                    />
                    <InputLabel
                      label="Deadline"
                      type="date"
                      required={true}
                      onChange={(event) =>
                        setBill({
                          ...bill,
                          deadline: event.currentTarget.value,
                        })
                      }
                    />
                  </div>
                  <div className="mx-4 h-full flex flex-col">
                    <InputLabel
                      label="Month"
                      required={true}
                      type="number"
                      value={bill.month}
                      onChange={(event) =>
                        setBill({
                          ...bill,
                          month: parseInt(event.currentTarget.value),
                        })
                      }
                    />
                    <InputLabel
                      label="Year"
                      type="number"
                      value={bill.year}
                      required={true}
                      onChange={(event) =>
                        setBill({
                          ...bill,
                          year: parseInt(event.currentTarget.value),
                        })
                      }
                    />
                  </div>
                </form>
              )}
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
