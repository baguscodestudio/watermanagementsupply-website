import React, { useEffect, useState } from 'react';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import InputLabel from '../../components/InputLabel';
import EquipmentType from '../../type/Equipment';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextAreaLabel from '../../components/TextAreaLabel';
import moment from 'moment';
import ComboboxLabel from '../../components/ComboboxLabel';
import { Link, useNavigate } from 'react-router-dom';

const MaintenanceCreate = () => {
  const [maintenance, setMaintenance] = useState({
    summary: '',
    details: '',
    date: '',
    cost: 0,
  });
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [queryEq, setQueryEq] = useState('');
  const [selEq, setSelEq] = useState('');
  const navigate = useNavigate();

  const filteredEq =
    queryEq === ''
      ? equipments.map((eq) => eq.equipmentName)
      : equipments
          .filter((eq) =>
            eq.equipmentName.toLowerCase().includes(queryEq.toLowerCase())
          )
          .map((eq) => eq.equipmentName);

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

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        'http://localhost:5000/api/Maintenance',
        {
          ...maintenance,
          equipmentId: equipments.find((eq) => eq.equipmentName == selEq)
            ?.equipmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully created new maintenance record');
        navigate('/maintenance');
      })
      .catch((err) => {
        toast.error('An error occured while creating maintenance record');
        console.log(err);
      });
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Maintenance Create" />
        <form className="flex py-10 px-12 h-[90vh]" onSubmit={handleCreate}>
          <div className="w-1/2 mx-auto">
            <InputLabel
              className="my-2"
              label="Summary"
              required={true}
              onChange={(event) => {
                setMaintenance({
                  ...maintenance,
                  summary: event.currentTarget.value,
                });
              }}
            />
            <TextAreaLabel
              className="my-2"
              label="Details"
              onChange={(event) => {
                setMaintenance({
                  ...maintenance,
                  details: event.currentTarget.value,
                });
              }}
            />
            <div className="inline-flex w-full my-2">
              <InputLabel
                className="w-2/5 mr-4"
                label="Cost"
                onChange={(event) => {
                  setMaintenance({
                    ...maintenance,
                    cost: parseFloat(event.currentTarget.value),
                  });
                }}
                type="number"
              />
              <InputLabel
                className="w-2/5"
                label="Date"
                onChange={(event) => {
                  setMaintenance({
                    ...maintenance,
                    date: moment(event.currentTarget.value).format(
                      'YYYY-MM-DD'
                    ),
                  });
                }}
                type="date"
              />
            </div>
            <ComboboxLabel
              className="w-1/3"
              filtered={filteredEq}
              selected={selEq}
              setSelected={setSelEq}
              setQuery={setQueryEq}
              title="Select Equipment"
            />
            <div className="inline-flex my-4">
              <Link
                to="/maintenance"
                className="rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit my-auto ml-auto hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceCreate;
