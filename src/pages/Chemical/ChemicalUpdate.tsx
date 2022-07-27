import { Menu } from '@headlessui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp } from 'styled-icons/bootstrap';
import NavBar from '../../components/NavBar';

const ChemicalUpdate = () => {
  const [chemical, setChemical] = useState({
    chemicalName: '',
    minQuantity: 0,
    quantity: 0,
    measureUnit: '',
    usageDescription: '',
  });
  const params = useParams();
  const id = params.chemicalId;
  const [updatePage, setUpdatePage] = useState('');
  const navigate = useNavigate();
  const items = [
    { label: 'Chemical Name', key: 'chemicalName' },
    { label: 'Min Quantity', key: 'minQuanity' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Measure Unit', key: 'measureUnit' },
    { label: 'Usage Description', key: 'usageDescription' },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Chemical/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setChemical(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting the chemical information');
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .put(
        'http://localhost:5000/api/Chemical',
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
    <>
      <NavBar />
      <div className="w-full grid grid-cols-2">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#FFA500] flex items-center px-12 col-span-2">
          Chemical Inventory
        </div>
        {updatePage !== '' ? (
          <div className="">
            <form
              className="flex flex-col ml-20 mt-24"
              id="chemical-info"
              onSubmit={(event) => handleSubmit(event)}
            >
              <div className="text-2xl mb-14 underline">
                Chemical Inventory Information
              </div>
              <div className="my-2 w-[27rem] inline-flex justify-between">
                <div className="text-lg">
                  {updatePage.charAt(0).toUpperCase() + updatePage.slice(1)}
                </div>
                <input
                  name={updatePage}
                  onChange={(event) =>
                    setChemical({
                      ...chemical,
                      [updatePage]: event.currentTarget.value,
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
                  Update
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
        ) : (
          <div></div>
        )}
        <div className="flex flex-col mt-24">
          <div className="mx-auto text-4xl font-bold underline">
            Chemical Inventory
          </div>
          <table className="mt-16 w-4/5 mx-auto">
            <tr className="bg-neutral-100 border-[2px] border-black">
              <th>Previous Inventory</th>
            </tr>
            <tr className="border-[2px] border-black">
              <td className="flex flex-col px-6 py-4">
                <div>
                  <strong>Chemical name: </strong>
                  {chemical.chemicalName}
                </div>
                <div>
                  <strong>Chemical min quantity: </strong>
                  {chemical.minQuantity}
                </div>
                <div>
                  <strong>Chemical quantity: </strong>
                  {chemical.quantity}
                </div>
                <div>
                  <strong>Chemical measure: </strong>
                  {chemical.measureUnit}
                </div>
                <div>
                  <strong>Chemical usage description: </strong>
                  {chemical.usageDescription}
                </div>
              </td>
            </tr>
          </table>
          <Menu as="div" className="relative mt-12 mx-auto">
            {({ open }) => (
              <>
                <Menu.Button className="h-full flex items-center px-4 py-1 justify-center hover:text-[#0e6e4b] bg-cyan-400 rounded-sm">
                  {open ? (
                    <>
                      Update <ChevronDown size="16" />
                    </>
                  ) : (
                    <>
                      Update <ChevronUp size="16" />
                    </>
                  )}
                </Menu.Button>
                <Menu.Items className="absolute origin-top-left bg-white text-left text-black rounded-b-md">
                  <div className="p-1">
                    {items.map((item, index) => {
                      return (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <button
                              onClick={() => setUpdatePage(item.key)}
                              className={`${
                                active && 'bg-emerald-500 text-white'
                              } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm text-left`}
                            >
                              {item.label}
                            </button>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </div>
                </Menu.Items>
              </>
            )}
          </Menu>
        </div>
      </div>
    </>
  );
};

export default ChemicalUpdate;