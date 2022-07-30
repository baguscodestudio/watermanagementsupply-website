import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { Plus } from '@styled-icons/boxicons-regular/Plus';

import NavBar from '../../components/NavBar';
import EquipmentType from '../../type/Equipment';
import EquipmentCard from '../../components/EquipmentCard';
import Header from '../../components/Header';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router-dom';

const Equipment = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [search, setSearch] = useState('');
  const [finalSearch, setFinalSearch] = useState('');
  const [page, setPage] = useState(0);

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
        toast.error('Error occured while getting equipments');
      });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFinalSearch(search);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Link
          to="/equipment/insert"
          className="absolute bottom-20 left-10 rounded-full w-12 h-12 text-white bg-green-500 hover:scale-105 hover:rotate-180 transition-all flex"
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
            className="rounded-lg ring-1 ring-gray-500 w-full h-12 my-8 inline-flex items-center px-6"
          >
            <button type="submit" className="mr-4">
              <Search size="24" />
            </button>
            <input
              placeholder="Search for equipment name"
              onChange={(event) => setSearch(event.currentTarget.value)}
              id="search"
              className="outline-none text-lg w-full"
            />
          </form>
          <div className="w-full h-[4px] bg-gray-200 -z-10 mt-[2px]" />
          <div className="flex flex-col my-4 pl-4">
            {equipments
              .filter((equipment) =>
                equipment.equipmentName
                  .toLowerCase()
                  .includes(finalSearch.toLowerCase())
              )
              .slice(page * 4, page * 4 + 4)
              .map((equipment, index) => (
                <EquipmentCard key={index} equipment={equipment} />
              ))}
          </div>
          <Pagination
            className="ml-auto mt-auto mb-8 inline-flex items-center"
            rows={equipments.length}
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
