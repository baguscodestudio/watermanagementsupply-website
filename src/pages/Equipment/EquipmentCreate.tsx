import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import NavBar from '../../components/NavBar';
import TextAreaLabel from '../../components/TextAreaLabel';

const EquipmentCreate = () => {
  const [equipment, setEquipment] = useState({
    equipmentName: '',
    installationDate: '',
    guaranteeDate: '',
    replacementPeriod: '',
    hardwareSpec: '',
    lifespan: 0,
    cost: 0,
    type: '',
  });
  const [selectedImage, setSelectedImage] = useState<File>();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedImage) return;

    axios
      .post(
        `${import.meta.env.VITE_REST_URL}/Equipment`,
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

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Insert" />
        <form
          className="flex flex-col py-10 px-12 h-[90vh] justify-center items-center"
          onSubmit={(event) => handleSubmit(event)}
          id="equipment-info"
        >
          <div className="mb-8 inline-flex w-1/2">
            <div className="flex flex-col mr-auto">
              <span className="text-3xl">Equipment Information</span>
              <span className="text-gray-500">Create equipment</span>
            </div>
            <Link
              to="/equipment"
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
          <div className="flex w-1/2">
            <div className="flex flex-col">
              {selectedImage ? (
                <img
                  className="h-48 w-48 mx-auto mb-4"
                  src={URL.createObjectURL(selectedImage)}
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
            </div>
            <div className="w-2/3 flex flex-col px-4">
              <InputLabel
                onChange={(event) =>
                  setEquipment({
                    ...equipment,
                    equipmentName: event.currentTarget.value,
                  })
                }
                label="Name"
                required={true}
                className="w-full my-2"
              />
              <InputLabel
                label="Type"
                onChange={(event) =>
                  setEquipment({
                    ...equipment,
                    type: event.currentTarget.value,
                  })
                }
                required={true}
                className="w-1/3 mr-auto my-2"
              />
              <div className="inline-flex justify-between w-full">
                <InputLabel
                  onChange={(event) =>
                    setEquipment({
                      ...equipment,
                      installationDate: event.currentTarget.value,
                    })
                  }
                  type="date"
                  label="Installation Date"
                  className="w-5/12 my-2"
                />
                <InputLabel
                  onChange={(event) =>
                    setEquipment({
                      ...equipment,
                      guaranteeDate: event.currentTarget.value,
                    })
                  }
                  type="date"
                  label="Guarantee Date"
                  className="w-5/12 my-2"
                />
              </div>
              <TextAreaLabel
                onChange={(event) =>
                  setEquipment({
                    ...equipment,
                    hardwareSpec: event.currentTarget.value,
                  })
                }
                label="Hardware Specification"
                className="w-full my-2"
              />
              <div className="inline-flex justify-between w-full">
                <InputLabel
                  onChange={(event) =>
                    setEquipment({
                      ...equipment,
                      lifespan: parseInt(event.currentTarget.value),
                    })
                  }
                  type="number"
                  label="Lifespan"
                  className="w-5/12 my-2"
                />
                <InputLabel
                  onChange={(event) =>
                    setEquipment({
                      ...equipment,
                      cost: parseFloat(event.currentTarget.value),
                    })
                  }
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

export default EquipmentCreate;
