import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { UserContext } from '../App';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import InputLabel from '../components/InputLabel';
import SelectLabel from '../components/SelectLabel';

const GENDERS = ['M', 'F'];

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [prevUser, setPrevUser] = useState(user);
  const [gender, setGender] = useState<'M' | 'F'>(user.gender);

  const checkChanges = () => {
    return prevUser === user && gender === prevUser.gender;
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .put(
        `${import.meta.env.VITE_REST_URL}/Staff/MyInfo`,
        {
          ...user,
          gender: gender,
          updatePassword: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully updated profile');
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while updating your profile!');
      });
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
          <div className="w-1/2 flex flex-col">
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
            <div className="w-2/3 mt-8">
              <InputLabel
                label="Username"
                className="my-3"
                value={user.username}
                onChange={(event) => {
                  setUser({ ...user, username: event.currentTarget.value });
                }}
              />
              <InputLabel
                className="my-3"
                label="Email"
                value={user.email}
                onChange={(event) => {
                  setUser({ ...user, email: event.currentTarget.value });
                }}
              />
              <div className="inline-flex justify-between my-3 w-full">
                <InputLabel
                  className="w-[45%]"
                  label="Phone"
                  value={user.phone}
                  onChange={(event) => {
                    setUser({ ...user, phone: event.currentTarget.value });
                  }}
                />
                <SelectLabel
                  className="w-[45%]"
                  title="Gender"
                  value={gender}
                  onChange={setGender}
                  list={GENDERS}
                />
              </div>
              <InputLabel
                className="my-3"
                label="Full Name"
                value={user.fullName}
                onChange={(event) => {
                  setUser({ ...user, fullName: event.currentTarget.value });
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
