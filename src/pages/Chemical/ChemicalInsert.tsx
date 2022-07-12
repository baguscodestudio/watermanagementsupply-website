import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';

const ChemicalInsert = () => {
  const [chemical, setChemical] = useState({
    chemicalName: '',
    minQuantity: 0,
    quantity: 0,
    measureUnit: '',
    usageDescription: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        'http://localhost:5000/api/Chemical',
        {
          ...chemical,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully inserted chemical!');
        navigate('/chemical');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while inserting chemical');
      });
  };

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-44 bg-[#F0E68C] flex items-center px-12">
          Chemical Inventory
        </div>
        <form
          className="flex flex-col ml-20 mt-24"
          id="chemical-info"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="text-2xl mb-14 underline">
            Chemical Inventory Information
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Chemical name:</div>
            <input
              name="name"
              onChange={(event) =>
                setChemical({
                  ...chemical,
                  chemicalName: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Chemical min quantity:</div>
            <input
              type="number"
              onChange={(event) =>
                setChemical({
                  ...chemical,
                  minQuantity: parseInt(event.currentTarget.value),
                })
              }
              name="minQuantity"
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Chemical quantity:</div>
            <input
              type="number"
              onChange={(event) =>
                setChemical({
                  ...chemical,
                  quantity: parseInt(event.currentTarget.value),
                })
              }
              name="quantity"
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Chemical measure unit:</div>
            <input
              name="measure-unit"
              onChange={(event) =>
                setChemical({
                  ...chemical,
                  measureUnit: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent "
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Chemical usage description:</div>
            <textarea
              name="usage-description"
              onChange={(event) =>
                setChemical({
                  ...chemical,
                  usageDescription: event.currentTarget.value,
                })
              }
              rows={5}
              cols={50}
              className="w-56 border-2 px-2 border-black bg-transparent disabled:bg-neutral-100"
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
              to="/chemical"
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

export default ChemicalInsert;
