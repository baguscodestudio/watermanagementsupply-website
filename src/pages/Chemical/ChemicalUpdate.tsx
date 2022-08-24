import { Menu } from '@headlessui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp } from 'styled-icons/bootstrap';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import NavBar from '../../components/NavBar';
import TextAreaLabel from '../../components/TextAreaLabel';
import ChemicalType from '../../type/Chemical';

const ChemicalUpdate = () => {
  const [chemical, setChemical] = useState<ChemicalType>();
  const [previousChem, setPreviousChem] = useState<ChemicalType>();
  const params = useParams();
  const id = params.chemicalId;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REST_URL}/Chemical/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setChemical(response.data);
        setPreviousChem(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting the chemical information');
      });
  }, []);

  const handleDelete = (id: string) => {
    axios
      .delete(`${import.meta.env.VITE_REST_URL}/Chemical/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        toast('Successfully deleted chemical');
        navigate('/chemical');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while deleting chemical');
      });
  };

  const checkChanges = () => {
    return chemical === previousChem;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log('submit trigger');
    event.preventDefault();
    axios
      .put(
        `${import.meta.env.VITE_REST_URL}/Chemical`,
        {
          chemicalId: id,
          ...chemical,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully updated chemical!');
        navigate('/chemical');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while updating chemical');
      });
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header
          title={chemical ? chemical.chemicalName : 'Chemical View/Update'}
        />
        <form
          className="flex flex-col py-10 px-12 h-[90vh] justify-center items-center"
          onSubmit={(event) => handleSubmit(event)}
          id="chemical-info"
        >
          <div className="mb-8 inline-flex w-1/3">
            <div className="flex flex-col mx-auto">
              <span className="text-5xl">Chemical Information</span>
              <span className="text-gray-500 text-xl">
                View or Update Chemical
              </span>
            </div>
          </div>
          <div className="w-1/3 flex flex-col">
            <InputLabel
              onChange={(event) => {
                if (!event.currentTarget.value || !chemical) return;
                setChemical({
                  ...chemical,
                  chemicalName: event.currentTarget.value,
                });
              }}
              value={chemical?.chemicalName}
              label="Name"
              required={true}
              className="w-full my-2"
            />
            <TextAreaLabel
              onChange={(event) => {
                if (!event.currentTarget.value || !chemical) return;
                setChemical({
                  ...chemical,
                  usageDescription: event.currentTarget.value,
                });
              }}
              value={chemical?.usageDescription}
              label="Description"
              className="w-full my-2"
            />
            <div className="inline-flex justify-between w-full">
              <InputLabel
                onChange={(event) => {
                  if (!event.currentTarget.value || !chemical) return;
                  setChemical({
                    ...chemical,
                    minQuantity: parseInt(event.currentTarget.value),
                  });
                }}
                type="number"
                value={chemical?.minQuantity}
                label="Min Quantity"
                className="w-5/12 my-2"
              />
              <InputLabel
                onChange={(event) => {
                  if (!event.currentTarget.value || !chemical) return;
                  setChemical({
                    ...chemical,
                    quantity: parseInt(event.currentTarget.value),
                  });
                }}
                type="number"
                value={chemical?.quantity}
                label="Quantity"
                className="w-5/12 my-2"
              />
            </div>
            <div className="inline-flex mt-4 ml-auto">
              <Link
                to="/chemical"
                className="rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit my-auto ml-auto hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(chemical?.chemicalId!)}
                className="rounded-lg px-4 h-fit py-1 my-auto ml-2 hover:shadow-lg hover:-translate-y-1 transition-all text-white bg-red-500 text-lg font-medium"
              >
                Delete
              </button>
              <button
                type="submit"
                disabled={checkChanges()}
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChemicalUpdate;
