import { Listbox, Menu } from '@headlessui/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CheckmarkOutline } from '@styled-icons/evaicons-outline/CheckmarkOutline';
import { ChevronDown, ChevronUp } from 'styled-icons/bootstrap';
import { UserContext } from '../App';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import InputLabel from '../components/InputLabel';
import SelectLabel from '../components/SelectLabel';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [prevUser, setPrevUser] = useState(user);
  const [confirmPass, setConfirmPass] = useState('');

  const navigate = useNavigate();

  const checkChanges = () => {
    return prevUser === user;
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmPass !== user.password) {
      toast.error('Password does not match!');
      return;
    } else {
      axios
        .put(
          'http://localhost:5000/api/Staff/MyInfo',
          {
            ...user,
            updatePassword: true,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          toast('Successfully updated password');
          navigate('/dashboard');
        })
        .catch((err) => {
          console.log(err);
          toast.error('An error occured while updating your password!');
        });
    }
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <Header title="Profile" />
        <form
          onSubmit={handleUpdate}
          className="w-full h-[90vh] flex px-12 py-8 justify-center"
        >
          <div className="mr-8">
            <img
              src={'/images/AvatarFill.png'}
              className="max-w-full h-auto w-full"
            />
          </div>
          <div className="w-1/3 flex flex-col">
            <div className="inline-flex items-center mt-4">
              <div className="flex flex-col">
                <span className="font-semibold text-3xl">{user.username}</span>
                <span className="text-gray-500 text-lg">{user.fullName}</span>
              </div>
              <div className="ml-auto">
                <Link
                  to="/dashboard"
                  className="text-lg rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit my-auto ml-auto hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={checkChanges()}
                  className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="w-full mt-8">
              <InputLabel
                label="Password"
                required={true}
                pattern="^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$"
                type="password"
                className="my-3"
                onChange={(event) => {
                  setUser({ ...user, password: event.currentTarget.value });
                }}
              />
              <InputLabel
                className="my-3"
                label="Confirm Password"
                pattern="^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$"
                required={true}
                type="password"
                value={user.email}
                onChange={(event) => {
                  setConfirmPass(event.currentTarget.value);
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
