import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';

const EquipmentCreate = () => {
  const [equipment, setEquipment] = useState({
    equipmentName: '',
    installationDate: '',
    guaranteeDate: '',
    hardwareSpec: '',
    cost: 0,
    type: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        'http://localhost:5000/api/Equipment',
        {
          ...equipment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully created equipment!');
        navigate('/equipment');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while inserting equipment');
      });
  };

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#E9967A] flex items-center px-12">
          Equipment
        </div>
        <form
          className="flex flex-col ml-20 mt-24"
          id="equipment-info"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="text-2xl mb-14 underline">Equipment Information</div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Equipment name:</div>
            <input
              name="name"
              onChange={(event) =>
                setEquipment({
                  ...equipment,
                  equipmentName: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Installation date:</div>
            <input
              type="date"
              onChange={(event) =>
                setEquipment({
                  ...equipment,
                  installationDate: event.currentTarget.value,
                })
              }
              name="installation-date"
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Guarantee:</div>
            <input
              name="guarantee"
              onChange={(event) =>
                setEquipment({
                  ...equipment,
                  guaranteeDate: event.currentTarget.value,
                })
              }
              type="date"
              className="w-56 border-2 px-2 border-black bg-transparent "
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Cost:</div>
            <input
              name="cost"
              type="number"
              step="0.01"
              onChange={(event) =>
                setEquipment({
                  ...equipment,
                  cost: parseFloat(event.currentTarget.value),
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent disabled:bg-neutral-100"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Hardware Specification:</div>
            <input
              name="hardware-specification"
              onChange={(event) =>
                setEquipment({
                  ...equipment,
                  hardwareSpec: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Type:</div>
            <input
              name="equipment-type"
              onChange={(event) =>
                setEquipment({
                  ...equipment,
                  type: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="inline-flex mt-16">
            <button
              type="submit"
              className="rounded-lg border-black bg-transparent border-2 px-4 py-1 mr-12"
            >
              Submit
            </button>
            <Link
              to="/equipment"
              className="rounded-lg border-black bg-transparent border-2 px-4 py-1"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default EquipmentCreate;
