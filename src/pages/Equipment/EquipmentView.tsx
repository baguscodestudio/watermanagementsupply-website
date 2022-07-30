import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircleFill } from 'styled-icons/bootstrap';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import NavBar from '../../components/NavBar';
import TextAreaLabel from '../../components/TextAreaLabel';
import EquipmentType from '../../type/Equipment';

const EquipmentView = () => {
  const [equipment, setEquipment] = useState<EquipmentType>();
  const [previousEq, setPreviousEq] = useState<EquipmentType>();
  const [selectedImage, setSelectedImage] = useState<File>();
  const params = useParams();
  const id = params.equipmentId;
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:5000/api/Equipment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        toast('Successfully deleted Equipment');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while deleting equipment');
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Equipment/EquipmentId/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setEquipment(response.data.result[0]);
        setPreviousEq(response.data.result[0]);
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
        'http://localhost:5000/api/Equipment',
        {
          equipment: equipment,
          imageFile: selectedImage,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
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

  const checkChanges = () => {
    return equipment === previousEq && !selectedImage;
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header
          title={equipment ? equipment.equipmentName : 'Equipment View/Update'}
        />
        <form
          className="flex flex-col py-10 px-12 h-[90vh] justify-center items-center"
          onSubmit={(event) => handleSubmit(event)}
          id="equipment-info"
        >
          <div className="mb-8 inline-flex w-1/2">
            <div className="flex flex-col mr-auto">
              <span className="text-3xl">Equipment Information</span>
              <span className="text-gray-500">View or update equipment</span>
            </div>
          </div>
          <div className="flex w-1/2">
            <div className="flex flex-col">
              {selectedImage ? (
                <img
                  className="h-48 w-48 mx-auto mb-4"
                  src={URL.createObjectURL(selectedImage)}
                />
              ) : equipment?.imageUrl ? (
                <img
                  className="h-48 w-48 mx-auto mb-4"
                  src={equipment?.imageUrl}
                />
              ) : (
                <div className="h-48 w-48 mx-auto mb-4 bg-gray-100" />
              )}
              <label
                htmlFor="imageUpload"
                className="px-4 py-1 rounded-lg bg-gray-200 w-fit hover:bg-gray-100 hover:cursor-pointer"
              >
                Upload
              </label>
              <input
                id="imageUpload"
                className="hidden"
                type="file"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!event.target.files) return;
                  setSelectedImage(event.target.files[0]);
                }}
              />
              <span className="text-lg inline-flex items-center mt-4">
                <CircleFill
                  size="16"
                  className={`${
                    equipment?.isActive ? 'text-green-500' : 'text-red-500'
                  } mr-2`}
                />
                {equipment?.isActive ? 'Running' : 'Offline'}
              </span>
              <div className="inline-flex items-center justify-between my-4">
                <Link
                  to="/equipment"
                  className="rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit hover:shadow-lg hover:-translate-y-1 transition-all w-[45%]"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={checkChanges()}
                  className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium w-[45%]"
                >
                  Save
                </button>
              </div>
              <button
                onClick={() => handleDelete(equipment?.equipmentId!)}
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-red-500 font-medium w-[45%]"
              >
                Delete
              </button>
            </div>
            <div className="w-2/3 flex flex-col px-4">
              <InputLabel
                onChange={(event) => {
                  if (!event.currentTarget.value || !equipment) return;
                  setEquipment({
                    ...equipment,
                    equipmentName: event.currentTarget.value,
                  });
                }}
                value={equipment?.equipmentName}
                label="Name"
                required={true}
                className="w-full my-2"
              />
              <InputLabel
                label="Type"
                onChange={(event) => {
                  if (!event.currentTarget.value || !equipment) return;
                  setEquipment({
                    ...equipment,
                    type: event.currentTarget.value,
                  });
                }}
                value={equipment?.type}
                required={true}
                className="w-1/3 mr-auto my-2"
              />
              <div className="inline-flex justify-between w-full">
                <InputLabel
                  onChange={(event) => {
                    if (!event.currentTarget.value || !equipment) return;
                    setEquipment({
                      ...equipment,
                      installationDate: event.currentTarget.value,
                    });
                  }}
                  value={moment(equipment?.installationDate).format(
                    'YYYY-MM-DD'
                  )}
                  type="date"
                  label="Installation Date"
                  className="w-5/12 my-2"
                />
                <InputLabel
                  onChange={(event) => {
                    if (!event.currentTarget.value || !equipment) return;
                    setEquipment({
                      ...equipment,
                      replacementPeriod: event.currentTarget.value,
                    });
                  }}
                  value={moment(equipment?.replacementPeriod).format(
                    'YYYY-MM-DD'
                  )}
                  type="date"
                  label="Replacement Date"
                  className="w-5/12 my-2"
                />
              </div>
              <InputLabel
                onChange={(event) => {
                  if (!event.currentTarget.value || !equipment) return;
                  setEquipment({
                    ...equipment,
                    guaranteeDate: event.currentTarget.value,
                  });
                }}
                value={moment(equipment?.guaranteeDate).format('YYYY-MM-DD')}
                type="date"
                label="Guarantee Date"
                className="w-5/12 my-2"
              />
              <TextAreaLabel
                onChange={(event) => {
                  if (!event.currentTarget.value || !equipment) return;
                  setEquipment({
                    ...equipment,
                    hardwareSpec: event.currentTarget.value,
                  });
                }}
                label="Hardware Specification"
                className="w-full my-2"
                value={equipment?.hardwareSpec}
              />
              <div className="inline-flex justify-between w-full">
                <InputLabel
                  onChange={(event) => {
                    if (!event.currentTarget.value || !equipment) return;
                    setEquipment({
                      ...equipment,
                      lifespan: parseInt(event.currentTarget.value),
                    });
                  }}
                  value={equipment?.lifespan}
                  type="number"
                  label="Lifespan"
                  className="w-5/12 my-2"
                />
                <InputLabel
                  onChange={(event) => {
                    if (!event.currentTarget.value || !equipment) return;
                    setEquipment({
                      ...equipment,
                      cost: parseFloat(event.currentTarget.value),
                    });
                  }}
                  value={equipment?.cost}
                  type="number"
                  label="Equipment Cost"
                  className="w-5/12 my-2"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentView;
