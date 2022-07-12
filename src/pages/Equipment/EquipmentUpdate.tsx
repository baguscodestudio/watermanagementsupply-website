import { Menu } from '@headlessui/react';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp } from 'styled-icons/bootstrap';
import NavBar from '../../components/NavBar';
import EquipmentType from '../../type/Equipment';

const EquipmentUpdate = () => {
  const [equipment, setEquipment] = useState<EquipmentType>();
  const params = useParams();
  const id = params.equipmentId;
  const [updatePage, setUpdatePage] = useState('');
  const navigate = useNavigate();
  const items = [
    { label: 'Equipment Name', key: 'equipmentName' },
    { label: 'Installation Date', key: 'installationDate' },
    { label: 'Guarantee Date', key: 'guaranteeDate' },
    { label: 'Replacement Period', key: 'replacementPeriod' },
    { label: 'Type', key: 'type' },
    { label: 'Lifespan', key: 'lifespan' },
    { label: 'Hardware Spec', key: 'hardwareSpec' },
    { label: 'Cost', key: 'cost' },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Equipment/EquipmentId/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setEquipment(response.data[0]);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting the equipment information');
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .put(
        'http://localhost:5000/api/equipment',
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
        toast('Successfully updated Equipment!');
        navigate('/equipment');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while updating eupment');
      });
  };

  return (
    <>
      <NavBar />
      <div className="w-full grid grid-cols-2">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#BC8F8F] flex items-center px-12 col-span-2">
          Equipment
        </div>
        {updatePage !== '' ? (
          <div className="">
            <form
              className="flex flex-col ml-20 mt-24"
              id="equipment-info"
              onSubmit={(event) => handleSubmit(event)}
            >
              <div className="text-2xl mb-14 underline">
                Equipment {equipment?.equipmentName}
              </div>
              <div className="my-2 w-[27rem] inline-flex justify-between">
                <div className="text-lg">
                  {updatePage.charAt(0).toUpperCase() + updatePage.slice(1)}
                </div>
                <input
                  name={updatePage}
                  onChange={(event) =>
                    setEquipment({
                      ...equipment!,
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
                  to="/equipment"
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
          <div className="mx-auto text-4xl font-bold underline">Equipment</div>
          <table className="mt-16 w-4/5 mx-auto">
            <tr className="bg-neutral-100 border-[2px] border-black">
              <th>Information</th>
            </tr>
            <tr className="border-[2px] border-black">
              <td className="flex flex-col px-6 py-4">
                <div>
                  <strong>Equipment name: </strong>
                  {equipment?.equipmentName}
                </div>
                <div>
                  <strong>Equipment Cost: </strong>${equipment?.cost}
                </div>
                <div>
                  <strong>Type: </strong>
                  {equipment?.type}
                </div>
                <div>
                  <strong>Installation Date: </strong>
                  {moment(equipment?.installationDate).format('DD-MM-YYYY')}
                </div>
                <div>
                  <strong>Guarantee Date: </strong>
                  {moment(equipment?.guaranteeDate).format('DD-MM-YYYY')}
                </div>
                <div>
                  <strong>Replacement: </strong>
                  {moment(equipment?.replacementPeriod).format('DD-MM-YYYY')}
                </div>
                <div>
                  <strong>Specification: </strong>
                  {equipment?.hardwareSpec}
                </div>
                <div>
                  <strong>Lifespan: </strong>
                  {equipment?.lifespan}
                </div>
                <div className="flex flex-col w-full">
                  <strong>Maintenances: </strong>
                  <div className="w-full rounded-lg border-2 overflow-clip">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2">
                          <th>Date</th>
                          <th>Summary</th>
                          <th>Details</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      {equipment?.maintenance?.map((main, index) => (
                        <tr>
                          <td>
                            {moment(main.maintenanceDate).format(
                              'HH:mm:ss DD/MM/YY'
                            )}
                          </td>
                          <td>{main.maintenanceSummary}</td>
                          <td>{main.maintenanceDetails}</td>
                          <td>${main.maintenanceCost}</td>
                        </tr>
                      ))}
                    </table>
                  </div>
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

export default EquipmentUpdate;
