import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import EquipmentType from '../type/Equipment';

const EquipmentCard = ({
  equipment,
  fetchEquipments,
}: {
  equipment: EquipmentType;
  fetchEquipments: () => void;
}) => {
  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:5000/api/Equipment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        toast('Successfully deleted Equipment');
        fetchEquipments();
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while deleting equipment');
      });
  };

  return (
    <div className="rounded-lg border-2 border-black flex px-4 py-3">
      <div className="bg-neutral-300 h-full w-1/3"></div>
      <div className="flex flex-col px-4 w-2/3">
        <div className="text-2xl">{equipment.equipmentName}</div>
        <div className="leading-tight">
          ID: {equipment.equipmentId}
          <br />
          Installation Date:{' '}
          {new Date(equipment.installationDate).toDateString()}
          <br />
          Guarantee Date: {new Date(equipment.guaranteeDate).toDateString()}
          <br />
          Specification:
          <br />
          {equipment.hardwareSpec}
        </div>
        <div className="inline-flex w-full justify-between mt-auto">
          <div className="flex flex-col w-2/3">
            <span>Type:</span>
            <div className="bg-neutral-300 rounded-full w-fit px-2">
              {equipment.type}
            </div>
          </div>
          <div className="flex flex-col w-1/3">
            <span>Cost:</span>
            <span className="font-bold text-green-500">${equipment.cost}</span>
          </div>
        </div>
        <div className="inline-flex w-full justify-around mt-4">
          <Link
            to={`/equipment/${equipment.equipmentId}`}
            className="rounded-xl px-4 text-lg border-[2px] border-black bg-[#B0C4DE]"
          >
            View
          </Link>
          <Link
            to={`/equipment/update/${equipment.equipmentId}`}
            className="rounded-xl px-4 text-lg border-[2px] border-black bg-[#FFDAB9]"
          >
            Update
          </Link>
          <button
            onClick={() => handleDelete(equipment.equipmentId)}
            className="rounded-xl px-4 text-lg border-[2px] border-black bg-[#FF3F29]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
