import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Pagination from '../../components/Pagination';

import ReportType from '../../type/Report';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Plus } from '@styled-icons/boxicons-regular/Plus';

const Reports = () => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [length, setLength] = useState(0);
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search !== '') {
      axios
        .get('http://localhost:5000/api/ReportTicket/Search', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: search,
          },
        })
        .then((response) => {
          setReports(response.data.result);
          setLength(response.data.metadata.count);
        })
        .catch((err) => {
          console.log(err);
          toast.error('An error occured while searching for reports');
        });
    } else {
      fetchReports();
    }
  };

  const fetchReports = () => {
    axios
      .get('http://localhost:5000/api/ReportTicket', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          page: page + 1,
        },
      })
      .then((response) => {
        setReports(response.data.result);
        setLength(response.data.metadata.count);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching reports');
      });
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Customer Related" />
        <div className="flex flex-col py-10 px-12 h-[90vh]">
          <div className="underline underline-offset-8 text-2xl font-medium decoration-sky-500 decoration-[6px]">
            Reports
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
              placeholder="Search for report"
              onChange={(event) => setSearch(event.currentTarget.value)}
              id="search"
              className="outline-none text-lg w-full"
            />
          </form>
          <table>
            <thead>
              <tr className="text-sm text-gray-500 border-b-2 border-gray-200 h-10">
                <th className="font-normal px-4 text-left w-2/12">
                  Created At
                </th>
                <th className="font-normal px-4 w-3/12">Title</th>
                <th className="font-normal px-4 w-1/12">Status</th>
                <th className="font-normal px-4 w-2/12">Customer Id</th>
                <th className="font-normal px-4 w-4/12">Description</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr
                  key={index}
                  onClick={() => navigate(`/reports/${report.reportId}`)}
                  className="h-12 border-b-2 border-gray-200 hover:text-gray-500 hover:cursor-pointer group border-collapse"
                >
                  <td>
                    <div className="px-4 py-2 group-hover:bg-gray-200 rounded-l-lg">
                      {moment(report.createdAt).format('hh:mm:ss A DD/MM/YYYY')}
                    </div>
                  </td>
                  <td className="">
                    <div className="px-4 py-2 group-hover:bg-gray-200">
                      {report.title}
                    </div>
                  </td>
                  <td className="">
                    <div className="px-4 py-1 group-hover:bg-gray-200">
                      <div
                        className={`px-4 py-1 text-white flex justify-center rounded-lg ${
                          report.status === 'Closed'
                            ? 'bg-red-500'
                            : 'bg-emerald-500'
                        }`}
                      >
                        {report.status}
                      </div>
                    </div>
                  </td>
                  <td className="relative">
                    <div className="px-4 py-2 group-hover:bg-gray-200 text-center">
                      {report.customerId}
                    </div>
                  </td>
                  <td className="relative">
                    <div className="px-4 py-2 group-hover:bg-gray-200 truncate rounded-r-lg">
                      {report.description}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            className="ml-auto mt-auto mb-8 inline-flex items-center"
            rows={length}
            rowsPerPage={10}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
