import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Paper from '../../components/Paper';
import Pagination from '../../components/Pagination';

import UserType from '../../type/User';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Plus } from '@styled-icons/boxicons-regular/Plus';

const StaffAccount = () => {
  const [staffs, setStaffs] = useState<UserType[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search !== '') {
      axios
        .get(`${import.meta.env.VITE_REST_URL}/Staff/Search`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: search,
          },
        })
        .then((response) => {
          setStaffs(response.data.result);
          setPage(0);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error occured while search for staffs');
        });
    } else fetchStaffs();
  };

  const fetchStaffs = () => {
    axios
      .get(`${import.meta.env.VITE_REST_URL}/Staff`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setStaffs(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting staffs');
      });
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Link
          to="/staff/create"
          className="absolute bottom-20 right-10 rounded-full w-12 h-12 text-white bg-green-500 hover:scale-105 hover:rotate-180 transition-all flex"
        >
          <Plus size="32" className="m-auto" />
        </Link>
        <Header title="Staff List" />
        <div className="flex flex-col py-10 px-12 h-[90vh]">
          <div className="underline underline-offset-8 text-2xl font-medium decoration-sky-500 decoration-[6px]">
            Staff
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
              placeholder="Search for staff"
              onChange={(event) => setSearch(event.currentTarget.value)}
              id="search"
              className="outline-none text-lg w-full"
            />
          </form>
          <div className="w-full flex flex-col">
            {staffs.slice(page * 5, page * 5 + 5).map((staff, index) => (
              <Paper
                className="w-full flex flex-col my-2 hover:scale-105 transition-transform hover:cursor-pointer"
                onClick={() => navigate(`/staff/${staff.userId}`)}
              >
                <div className="w-full h-2 bg-sky-500" />
                <div className="inline-flex px-10 py-2 items-center">
                  <div className="flex flex-col w-1/5">
                    <span className="font-semibold text-lg">
                      {staff.username}
                    </span>
                    <span className="text-gray-500">{staff.fullName}</span>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <span className="text-gray-500">Email</span>
                    <span className="">{staff.email}</span>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <span className="text-gray-500">Gender</span>
                    <span className="">{staff.gender}</span>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <span className="text-gray-500">Phone</span>
                    <span className="">{staff.phone}</span>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <span className="text-gray-500">Role</span>
                    <span className="">{staff.staffRole}</span>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
          <Pagination
            className="mt-auto mb-8 mr-auto"
            rows={staffs.length}
            rowsPerPage={5}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffAccount;
