import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import TextAreaLabel from '../../components/TextAreaLabel';
import InputLabel from '../../components/InputLabel';

const BroadcastCreate = () => {
  const [broadcast, setBroadcast] = useState({
    alertTitle: '',
    alertDescription: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        'http://localhost:5000/api/BroadcastAlert',
        {
          ...broadcast,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully announced broadcast!');
        navigate('/broadcast');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error while announcing broadcast');
      });
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Broadcast" />
        <div className="flex flex-col py-10 px-12 h-[90vh] items-center">
          <div className="w-1/2 flex flex-col">
            <span className="font-semibold text-4xl">
              Create an Announcement
            </span>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col w-1/2">
            <InputLabel
              label="Title"
              className="mt-6 mb-2"
              required={true}
              onChange={(event) =>
                setBroadcast({
                  ...broadcast,
                  alertTitle: event.currentTarget.value,
                })
              }
            />
            <TextAreaLabel
              label="Description"
              rows={10}
              value={broadcast?.alertDescription}
              className="mb-6 mt-2"
              required={true}
              onChange={(event) =>
                setBroadcast({
                  ...broadcast,
                  alertDescription: event.currentTarget.value,
                })
              }
            />
            <div className="inline-flex mr-auto">
              <Link
                to="/broadcast"
                className="rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Back
              </Link>
              <button
                type="submit"
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BroadcastCreate;
