import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import NavBar from '../../components/NavBar';
import TextAreaLabel from '../../components/TextAreaLabel';

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
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Insert" />
        <form
          className="flex flex-col py-10 px-12 h-[90vh] justify-center items-center"
          onSubmit={(event) => handleSubmit(event)}
          id="chemical-info"
        >
          <div className="mb-8 inline-flex w-1/2">
            <div className="flex flex-col mr-auto">
              <span className="text-3xl">Chemical Information</span>
              <span className="text-gray-500">Create Chemical</span>
            </div>
            <Link
              to="/chemical"
              className="rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit my-auto ml-auto hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg px-4 h-fit py-1 my-auto ml-2 hover:shadow-lg hover:-translate-y-1 transition-all text-white bg-green-500 text-lg font-medium"
            >
              Create
            </button>
          </div>
          <div className="w-1/3 flex flex-col">
            <InputLabel
              onChange={(event) =>
                setChemical({
                  ...chemical,
                  chemicalName: event.currentTarget.value,
                })
              }
              label="Name"
              required={true}
              className="w-full my-2"
            />
            <InputLabel
              label="Measure Unit"
              onChange={(event) =>
                setChemical({
                  ...chemical,
                  measureUnit: event.currentTarget.value,
                })
              }
              required={true}
              className="w-1/3 mr-auto my-2"
            />
            <TextAreaLabel
              onChange={(event) =>
                setChemical({
                  ...chemical,
                  usageDescription: event.currentTarget.value,
                })
              }
              label="Description"
              className="w-full my-2"
            />
            <div className="inline-flex justify-between w-full">
              <InputLabel
                onChange={(event) =>
                  setChemical({
                    ...chemical,
                    minQuantity: parseInt(event.currentTarget.value),
                  })
                }
                type="number"
                label="Min Quantity"
                className="w-5/12 my-2"
              />
              <InputLabel
                onChange={(event) =>
                  setChemical({
                    ...chemical,
                    quantity: parseInt(event.currentTarget.value),
                  })
                }
                type="number"
                label="Quantity"
                className="w-5/12 my-2"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChemicalInsert;
