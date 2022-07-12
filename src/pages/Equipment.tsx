import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Menu } from '@styled-icons/entypo/Menu';
import NavBar from '../components/NavBar';
import EquipmentType from '../type/Equipment';
import EquipmentCard from '../components/EquipmentCard';

const Equipment = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [search, setSearch] = useState('');
  const [finalSearch, setFinalSearch] = useState('');

  const fetchEquipments = () => {
    axios
      .get('http://localhost:5000/api/Equipment/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setEquipments(response.data);
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
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#BC8F8F] flex items-center px-12">
          Equipment
        </div>
        <div className="flex">
          <div className="w-1/5 p-4">
            <div className="inline-flex w-full text-2xl items-center">
              <Menu size="24" className="mr-2" />
              Menu
            </div>
            <div className="w-full mt-2 p-2 flex flex-col border-[2px] border-black rounded-lg lg:min-h-[30rem]">
              <form
                onSubmit={(event) => handleSearch(event)}
                className="w-full flex px-4 my-2 flex-col"
              >
                <input
                  placeholder="Search for equipment name"
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  id="search"
                  className="border-[2px] border-black h-8 px-2 py-1"
                />
                <button
                  type="submit"
                  className="bg-transparent rounded-lg px-4 py-1 border-2 w-fit mt-2 border-black hover:scale-105 transition-transform"
                >
                  Search
                </button>
              </form>
              <Link
                to="/equipment/insert"
                id="insert"
                className="bg-transparent rounded-lg px-4 mx-4 my-2 w-fit py-1 border-2 border-black hover:scale-105 transition-transform"
              >
                Insert Equipment
              </Link>
            </div>
          </div>
          <div className="flex w-4/5 mt-12 pl-4 h-[60vh] overflow-auto">
            <div className="grid gap-6 grid-cols-2 w-[95%]">
              {equipments
                .filter((equipment) =>
                  equipment.equipmentName
                    .toLowerCase()
                    .includes(finalSearch.toLowerCase())
                )
                .map((equipment, index) => (
                  <EquipmentCard
                    key={index}
                    equipment={equipment}
                    fetchEquipments={fetchEquipments}
                  />
                ))}
            </div>
            <div className="w-[16px] ml-auto mr-4 bg-neutral-300 h-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Equipment;
