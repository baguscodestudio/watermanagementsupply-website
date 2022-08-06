import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Plus } from '@styled-icons/boxicons-regular/Plus';

import NavBar from '../../components/NavBar';
import EquipmentCard from '../../components/EquipmentCard';
import Header from '../../components/Header';
import Pagination from '../../components/Pagination';

import EquipmentType from '../../type/Equipment';

const Equipment = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(1);

  const fetchEquipments = () => {
    axios
      .get('http://localhost:5000/api/Equipment', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          page: page + 1,
          pageSize: 4,
        },
      })
      .then((response) => {
        setEquipments([...response.data.result]);
        setLength(response.data.metadata.count);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting equipments');
      });
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
          setLength(response.data.metadata.count);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error occured while getting equipments');
        });
    } else fetchEquipments();
  };

  useEffect(() => {
    fetchEquipments();
  }, [page]);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Link
          to="/equipment/insert"
          className="absolute bottom-10 2xl:bottom-20 left-10 rounded-full w-8 h-8 2xl:w-12 2xl:h-12 text-white bg-green-500 hover:scale-105 hover:rotate-180 transition-all flex"
        >
          <Plus size="32" className="m-auto" />
        </Link>
        <Header title="Assets" />
        <div className="flex flex-col py-10 px-12 h-[90vh]">
          <div className="underline underline-offset-8 text-2xl font-medium decoration-sky-500 decoration-[6px]">
            Equipments
          </div>
          <div className="w-full h-[4px] bg-gray-200 -z-10 mt-[2px]" />
          <form
            onSubmit={(event) => handleSearch(event)}
            className="rounded-lg ring-1 ring-gray-500 w-full h-10 2xl:h-12 my-4 2xl:my-8 inline-flex items-center px-6"
          >
            <button type="submit" className="mr-4">
              <Search size="24" />
            </button>
            <input
              placeholder="Search for equipment name"
              onChange={(event) => setSearch(event.currentTarget.value)}
              id="search"
              className="outline-none 2xl:text-lg w-full"
            />
          </form>
          <div className="w-full h-[4px] bg-gray-200 -z-10 mt-[2px]" />
          <div className="flex flex-col my-4 pl-4">
            {equipments.map((equipment, index) => (
              <EquipmentCard key={index} equipment={equipment} />
            ))}
          </div>
          <Pagination
            className="ml-auto mt-auto mb-8 inline-flex items-center"
            rows={length}
            rowsPerPage={4}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Equipment;
