import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import BroadcastType from '../../type/Broadcast';

import { Info } from '@styled-icons/fa-solid/Info';
import { TextParagraph } from '@styled-icons/bootstrap/TextParagraph';
import { CalendarDateFill } from '@styled-icons/bootstrap/CalendarDateFill';

const Broadcast = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastType[]>([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const handleSearch = () => {
    setFilter(search);
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/BroadcastAlert', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setBroadcasts(response.data))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while getting broadcasts');
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-44 bg-[#FA8072] flex items-center px-12">
          Broadcast Alert
        </div>
        <div className="w-full flex">
          <div className="w-1/5 p-6">
            <div className="flex flex-col items-start border-2 border-black rounded-lg p-4">
              <input
                className="w-56 border-2 px-2 border-black bg-transparent my-2"
                name="search"
                placeholder="Search Title"
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
              <button
                onClick={handleSearch}
                className="rounded-lg border-black bg-transparent border-2 px-4 py-1 mr-12 my-2"
              >
                Search
              </button>
              <Link
                to="/broadcast/create"
                className="rounded-lg border-black bg-transparent border-2 px-4 py-1 mr-12 my-2"
              >
                New Broadcast
              </Link>
            </div>
          </div>
          <div className="w-4/5 p-6">
            <div className="shadow-2xl w-full rounded-lg bg-white min-h-[70vh] max-h-[70vh] overflow-auto ">
              <table className="w-full relative">
                <thead className="h-12">
                  <tr>
                    <th className="w-2/12 sticky top-0 bg-white">
                      <CalendarDateFill size="24" />
                      Date
                    </th>
                    <th className="w-4/12 sticky top-0 bg-white">
                      <Info size="24" />
                      Title
                    </th>
                    <th className="w-6/12 sticky top-0 bg-white">
                      <TextParagraph size="24" />
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {broadcasts
                    .filter((broadcast) =>
                      broadcast.alertTitle
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                    )
                    .map((broadcast, index) => (
                      <tr className="h-10 border-y-2">
                        <td className="px-4">
                          {new Date(broadcast.createdAt).toLocaleTimeString() +
                            ' ' +
                            new Date(broadcast.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4">{broadcast.alertTitle}</td>
                        <td className="truncate px-4">
                          {broadcast.alertDescription}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Broadcast;
