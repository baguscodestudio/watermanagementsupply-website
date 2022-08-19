import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import TextAreaLabel from '../../components/TextAreaLabel';

import BroadcastType from '../../type/Broadcast';

const BroadcastView = () => {
  const params = useParams();
  const [broadcast, setBroadcast] = useState<BroadcastType>();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REST_URL}/BroadcastAlert/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setBroadcast(response.data))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching broadcast');
      });
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Broadcast" />
        <div className="flex flex-col py-10 px-12 h-[90vh] items-center">
          <div className="w-1/2 flex flex-col">
            <span className="font-semibold text-4xl">
              {broadcast?.alertTitle}
            </span>
            <span className="text-lg">
              {moment(broadcast?.createdAt).format('hh:mm:ss A DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex flex-col w-1/2">
            <TextAreaLabel
              label="Description"
              rows={10}
              value={broadcast?.alertDescription}
              className="my-6"
              onChange={() => ''}
              disabled={true}
            />
            <Link
              to="/broadcast"
              className="rounded-lg mr-auto border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastView;
