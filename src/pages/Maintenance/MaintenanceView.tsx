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
import { Link, useNavigate, useParams } from 'react-router-dom';
import MaintenanceType from '../../type/Maintenance';

const MaintenanceView = () => {
  const [maintenance, setMaintenance] = useState<MaintenanceType>();
  const [prevMt, setPrevMt] = useState<MaintenanceType>();
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [queryEq, setQueryEq] = useState('');
  const [selEq, setSelEq] = useState('');
  const navigate = useNavigate();
  const params = useParams();

  const checkChanges = () => {
    return (
      prevMt === maintenance &&
      prevMt?.equipmentId ===
        equipments.find((eq) => eq.equipmentName === selEq)?.equipmentId
    );
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/Maintenance/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        toast('Successfully deleted maintenance record!');
        navigate('/maintenance');
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while deleting maintenance record');
      });
  };

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
        axios
          .get(`http://localhost:5000/api/Maintenance/${params.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
          .then((mt) => {
            setMaintenance(mt.data);
            setPrevMt(mt.data);
            setSelEq(
              response.data.result.find(
                (eq: EquipmentType) => eq.equipmentId === mt.data.equipmentId
              )?.equipmentName
            );
          })
          .catch((err) => {
            console.log(err);
            toast.error('An error occured while fetching maintenance record');
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting equipments');
      });
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .put(
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
        toast('Successfully updated new maintenance record');
        navigate('/maintenance');
      })
      .catch((err) => {
        toast.error('An error occured while updating maintenance record');
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
        <Header title="Maintenance View or Update" />
        <form className="flex py-10 px-12 h-[90vh]" onSubmit={handleCreate}>
          <div className="w-1/2 mx-auto">
            <InputLabel
              className="my-2"
              label="Summary"
              required={true}
              value={maintenance?.summary}
              onChange={(event) => {
                if (!maintenance) return;
                setMaintenance({
                  ...maintenance,
                  summary: event.currentTarget.value,
                });
              }}
            />
            <TextAreaLabel
              className="my-2"
              label="Details"
              value={maintenance?.details}
              onChange={(event) => {
                if (!maintenance) return;
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
                value={maintenance?.cost}
                onChange={(event) => {
                  if (!maintenance) return;
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
                value={moment(maintenance?.date).format('YYYY-MM-DD')}
                onChange={(event) => {
                  if (!maintenance) return;
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
                type="button"
                onClick={handleDelete}
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-red-500 font-medium text-lg"
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

export default MaintenanceView;
