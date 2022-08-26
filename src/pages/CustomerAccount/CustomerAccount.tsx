import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Paper from '../../components/Paper';
import Pagination from '../../components/Pagination';

import CustomerType from '../../type/Customer';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Plus } from '@styled-icons/boxicons-regular/Plus';

const CustomerAccount = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(0);
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
        .then((response) => {
          setCustomers(response.data.result);
          setPage(0);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error occured while searching for customers');
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
      .then((response) => {
        setCustomers(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting customers');
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Link
          to="/customer/create"
          className="absolute bottom-20 right-10 rounded-full w-12 h-12 text-white bg-green-500 hover:scale-105 hover:rotate-180 transition-all flex"
        >
          <Plus size="32" className="m-auto" />
        </Link>
        <Header title="Customer List" />
        <div className="flex flex-col py-10 px-12 h-[90vh]">
          <div className="underline underline-offset-8 text-2xl font-medium decoration-sky-500 decoration-[6px]">
            Customers
          </div>
          <div className="w-full h-[4px] bg-gray-200 -z-10 mt-[2px]" />
          <form
            onSubmit={handleSearch}
            className="rounded-lg ring-1 ring-gray-500 w-full h-12 my-8 inline-flex items-center px-6"
          >
            <button type="submit" className="mr-4">
              <Search size="24" />
            </button>
            <input
              placeholder="Search for customer"
              onChange={(event) => setSearch(event.currentTarget.value)}
              id="search"
              className="outline-none text-lg w-full"
            />
          </form>
          <div className="w-full flex flex-col">
            {customers.slice(page * 5, page * 5 + 5).map((customer, index) => (
              <Paper
                className="w-full flex flex-col my-2 hover:scale-105 transition-transform hover:cursor-pointer"
                onClick={() => navigate(`/customer/${customer.userId}`)}
              >
                <div className="w-full h-2 bg-sky-500" />
                <div className="inline-flex px-10 py-2 items-center">
                  <div className="flex flex-col w-1/5">
                    <span className="font-semibold text-lg">
                      {customer.username}
                    </span>
                    <span className="text-gray-500">{customer.fullName}</span>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <span className="text-gray-500">Email</span>
                    <span className="">{customer.email}</span>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <span className="text-gray-500">Gender</span>
                    <span className="">{customer.gender}</span>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <span className="text-gray-500">Phone</span>
                    <span className="">{customer.phone}</span>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <span className="text-gray-500">Address</span>
                    <span className="">{customer.address}</span>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
          <Pagination
            className="mt-auto mb-8 mr-auto"
            rows={customers.length}
            rowsPerPage={5}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;
