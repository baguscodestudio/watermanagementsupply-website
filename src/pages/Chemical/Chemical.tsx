import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Warning } from '@styled-icons/fluentui-system-regular/Warning';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import ChecmicalType from '../../type/Chemical';
import { formatter } from '../../utils';

const Chemical = () => {
  const [chemicals, setChemicals] = useState<ChecmicalType[]>([]);
  const [search, setSearch] = useState('');
  const [finalSearch, setFinalSearch] = useState('');

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

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:5000/api/Chemical/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        toast('Successfully deleted chemical');
        fetchChemicals();
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while deleting chemical');
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
      <div className="w-[85vw] h-full">
        <Header title="Assets" />
        <div className="flex flex-col py-10 px-12">
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
                .map((chemical, index) => (
                  <tr key={index} className="h-12 border-b-2 border-gray-200">
                    <td className="px-4">{chemical.chemicalName}</td>
                    <td className="text-center">{chemical.minQuantity}</td>
                    <td className="text-center relative">
                      {formatter.format(chemical.quantity)}
                      {chemical.minQuantity > chemical.quantity && (
                        <Warning
                          size="24"
                          className="absolute right-8 text-red-500"
                        />
                      )}
                    </td>
                    <td className="text-center">{chemical.measureUnit}</td>
                    <td>{chemical.usageDescription}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Chemical;
