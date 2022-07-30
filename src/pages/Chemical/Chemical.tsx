import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Plus } from '@styled-icons/boxicons-regular/Plus';
import { Search } from '@styled-icons/boxicons-regular/Search';
import { Warning } from '@styled-icons/fluentui-system-regular/Warning';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import ChecmicalType from '../../type/Chemical';
import { formatter } from '../../utils';
import Pagination from '../../components/Pagination';

const Chemical = () => {
  const [chemicals, setChemicals] = useState<ChecmicalType[]>([]);
  const [search, setSearch] = useState('');
  const [finalSearch, setFinalSearch] = useState('');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const fetchChemicals = () => {
    axios
      .get('http://localhost:5000/api/Chemical', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setChemicals(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting chemicals');
      });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFinalSearch(search);
  };

  useEffect(() => {
    fetchChemicals();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Link
          to="/chemical/insert"
          className="absolute bottom-20 left-10 rounded-full w-12 h-12 text-white bg-green-500 hover:scale-105 hover:rotate-180 transition-all flex"
        >
          <Plus size="32" className="m-auto" />
        </Link>
        <Header title="Assets" />
        <div className="flex flex-col py-10 px-12 h-[90vh]">
          <div className="underline underline-offset-8 text-2xl font-medium decoration-sky-500 decoration-[6px]">
            Chemicals
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
                <th className="font-normal px-4 text-left w-2/12">Name</th>
                <th className="font-normal px-4 w-1/12">Min Quantity</th>
                <th className="font-normal px-4 w-2/12">Quantity</th>
                <th className="font-normal px-4 w-1/12">Measure Unit</th>
                <th className="font-normal px-4 text-left w-6/12">Desc</th>
              </tr>
            </thead>
            <tbody>
              {chemicals
                .filter((chemical) =>
                  chemical.chemicalName
                    .toLowerCase()
                    .includes(finalSearch.toLowerCase())
                )
                .slice(page * 9, page * 9 + 9)
                .map((chemical, index) => (
                  <tr
                    key={index}
                    onClick={() => navigate(`/chemical/${chemical.chemicalId}`)}
                    className="h-12 border-b-2 border-gray-200 hover:text-gray-500 hover:cursor-pointer group border-collapse"
                  >
                    <td>
                      <div className="px-4 py-1 group-hover:bg-gray-200 rounded-l-lg">
                        {chemical.chemicalName}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="px-4 py-1 group-hover:bg-gray-200">
                        {chemical.minQuantity}
                      </div>
                    </td>
                    <td className="text-center relative">
                      <div className="px-4 py-1 group-hover:bg-gray-200">
                        {formatter.format(chemical.quantity)}
                        {chemical.minQuantity > chemical.quantity && (
                          <Warning
                            size="24"
                            className="absolute right-8 text-red-500"
                          />
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="px-4 py-1 group-hover:bg-gray-200">
                        {chemical.measureUnit}
                      </div>
                    </td>
                    <td>
                      <div className="px-4 py-1 group-hover:bg-gray-200 rounded-r-lg">
                        {chemical.usageDescription}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            className="ml-auto mt-auto mb-8 inline-flex items-center"
            rows={chemicals.length}
            rowsPerPage={9}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chemical;
