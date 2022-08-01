import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Pagination from '../../components/Pagination';

import BroadcastType from '../../type/Broadcast';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Plus } from '@styled-icons/boxicons-regular/Plus';

const Broadcast = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastType[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search !== '') {
      axios
        .get('http://localhost:5000/api/BroadcastAlert/Search', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: search,
          },
        })
        .then((response) => {
          setBroadcasts(response.data.result);
        })
        .catch((err) => {
          console.log(err);
          toast.error('An error occured while searching for broadcasts');
        });
    } else {
      fetchBroadcasts();
    }
  };

  const fetchBroadcasts = () => {
    axios
      .get('http://localhost:5000/api/BroadcastAlert', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setBroadcasts(response.data.result))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while getting broadcasts');
      });
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Link
          to="/broadcast/create"
          className="absolute bottom-20 left-10 rounded-full w-12 h-12 text-white bg-green-500 hover:scale-105 hover:rotate-180 transition-all flex"
        >
          <Plus size="32" className="m-auto" />
        </Link>
        <Header title="Customer Related" />
        <div className="flex flex-col py-10 px-12 h-[90vh]">
          <div className="underline underline-offset-8 text-2xl font-medium decoration-sky-500 decoration-[6px]">
            Broadcasts
          </div>
          <div className="w-full h-[4px] bg-gray-200 -z-10 mt-[2px]" />
          <form
            onSubmit={(event) => handleSearch(event)}
            className="rounded-lg ring-1 ring-gray-500 w-full h-12 my-8 inline-flex items-center px-6"
          >
            <button type="submit" className="mr-4">
              <Search size="24" />
            </button>
            <input
              placeholder="Search for chemical name"
              onChange={(event) => setSearch(event.currentTarget.value)}
              id="search"
              className="outline-none text-lg w-full"
            />
          </form>
          <table>
            <thead>
              <tr className="text-sm text-gray-500 border-b-2 border-gray-200 h-10">
                <th className="font-normal px-4 text-left w-2/12">Date</th>
                <th className="font-normal px-4 w-3/12">Title</th>
                <th className="font-normal px-4 w-7/12">Description</th>
              </tr>
            </thead>
            <tbody>
              {broadcasts
                .slice(page * 9, page * 9 + 9)
                .map((broadcast, index) => (
                  <tr
                    key={index}
                    onClick={() => navigate(`/broadcast/${broadcast.alertId}`)}
                    className="h-12 border-b-2 border-gray-200 hover:text-gray-500 hover:cursor-pointer group border-collapse"
                  >
                    <td>
                      <div className="px-4 py-1 group-hover:bg-gray-200 rounded-l-lg">
                        {moment(broadcast.createdAt)
                          .utc()
                          .format('hh:mm:ss A DD/MM/YYYY')}
                      </div>
                    </td>
                    <td className="">
                      <div className="px-4 py-1 group-hover:bg-gray-200">
                        {broadcast.alertTitle}
                      </div>
                    </td>
                    <td className=" relative">
                      <div className="px-4 py-1 group-hover:bg-gray-200">
                        {broadcast.alertDescription}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            className="ml-auto mt-auto mb-8 inline-flex items-center"
            rows={broadcasts.length}
            rowsPerPage={9}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
