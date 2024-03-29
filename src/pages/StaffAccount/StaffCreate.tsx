import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import NavBar from '../../components/NavBar';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import SelectLabel from '../../components/SelectLabel';

const GENDERS = ['M', 'F'];
const ROLES = ['UserAdmin', 'Technician', 'CustomerSupport'];

const StaffCreate = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState(GENDERS[0]);
  const [role, setRole] = useState(ROLES[0]);
  const [staff, setStaff] = useState({
    username: '',
    password: '',
    fullName: '',
    gender: 'M',
    email: '',
    phone: '',
    staffRole: '',
    type: 'Staff',
  });

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (staff.password !== confirmPassword) {
      toast.error('Password does not match!');
    } else {
      axios
        .post(
          `${import.meta.env.VITE_REST_URL}/Staff`,
          {
            ...staff,
            staffRole: role,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          toast('Successfully created staff!');
          navigate('/staff');
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error while inserting staff');
        });
    }
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <Header title="Create Staff Account" />
        <form
          onSubmit={handleSubmit}
          className="w-full h-[90vh] flex px-12 py-8 justify-center"
        >
          <div className="mr-8 mt-8">
            <img
              src={'/images/AvatarFill.png'}
              className="max-w-full h-auto w-full"
            />
          </div>
          <div className="w-1/3 flex flex-col mt-8">
            <div className="w-full">
              <InputLabel
                label="Username"
                className="my-3"
                required={true}
                value={staff?.username}
                onChange={(event) => {
                  if (!staff) return;
                  setStaff({
                    ...staff,
                    username: event.currentTarget.value,
                  });
                }}
              />
              <InputLabel
                label="Password"
                required={true}
                pattern="^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$"
                type="password"
                className="my-3"
                onChange={(event) => {
                  setStaff({
                    ...staff,
                    password: event.currentTarget.value,
                  });
                }}
              />
              <InputLabel
                className="my-3"
                label="Confirm Password"
                pattern="^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$"
                required={true}
                type="password"
                onChange={(event) => {
                  setConfirmPassword(event.currentTarget.value);
                }}
              />
              <InputLabel
                className="my-3"
                label="Email"
                required={true}
                value={staff?.email}
                onChange={(event) => {
                  if (!staff) return;
                  setStaff({
                    ...staff,
                    email: event.currentTarget.value,
                  });
                }}
              />
              <div className="inline-flex justify-between my-3 w-full">
                <InputLabel
                  className="w-[45%]"
                  label="Phone"
                  required={true}
                  value={staff?.phone}
                  onChange={(event) => {
                    if (!staff) return;
                    setStaff({
                      ...staff,
                      phone: event.currentTarget.value,
                    });
                  }}
                />
                <SelectLabel
                  className="w-[45%]"
                  title="Gender"
                  value={gender ? gender : 'M'}
                  onChange={setGender}
                  list={GENDERS}
                />
              </div>
              <InputLabel
                className="my-3"
                label="Full Name"
                required={true}
                value={staff?.fullName}
                onChange={(event) => {
                  if (!staff) return;
                  setStaff({
                    ...staff,
                    fullName: event.currentTarget.value,
                  });
                }}
              />
              <SelectLabel
                title="Staff Role"
                required={true}
                list={ROLES}
                onChange={setRole}
                value={role}
              />
            </div>
            <div className="my-4 inline-flex">
              <Link
                to="/staff"
                className="rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit my-auto ml-auto hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffCreate;
