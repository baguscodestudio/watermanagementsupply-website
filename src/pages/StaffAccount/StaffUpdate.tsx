import { Listbox, Menu } from '@headlessui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import NavBar from '../../components/NavBar';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import SelectLabel from '../../components/SelectLabel';
import UserType from '../../type/User';

const GENDERS = ['M', 'F'];
const ROLES = ['UserAdmin', 'Technician', 'CustomerSupport'];
const MODE = ['Update Password', 'Profile'];

const StaffUpdate = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState(GENDERS[0]);
  const [mode, setMode] = useState(MODE[1]);
  const [role, setRole] = useState(ROLES[0]);
  const [staff, setStaff] = useState<UserType>();
  const [prevStaff, setPrevStaff] = useState<UserType>();
  const params = useParams();
  const id = params.staffId;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Staff/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setStaff(response.data);
        setPrevStaff(response.data);
        setRole(response.data.staffRole);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting the staff information');
      });
  }, []);

  const checkChanges = () => {
    return (
      prevStaff === staff &&
      staff?.gender === gender &&
      staff.staffRole === role
    );
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/staff/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        toast('Successfully deleted staff account');
        navigate('/staff');
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while deleting staff account');
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmPassword && staff?.password !== confirmPassword) {
      toast.error('Password and Confirm Password does not match!');
    } else {
      axios
        .put(
          'http://localhost:5000/api/Staff',
          {
            userId: id,
            updatePassword: staff?.password === confirmPassword,
            ...staff,
            staffRole: role,
            gender: gender,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          toast('Successfully updated staff!');
          navigate('/staff');
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error while updating staff');
        });
    }
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <Header title="Staff View or Update" />
        <form
          onSubmit={handleSubmit}
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
                <span className="font-semibold text-3xl">
                  {staff?.username}
                </span>
                <span className="text-gray-500 text-lg">{staff?.fullName}</span>
              </div>
            </div>
            <div className="w-full mt-8">
              {mode === 'Profile' ? (
                <>
                  <InputLabel
                    label="Username"
                    className="my-3"
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
                    className="my-3"
                    label="Email"
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
                    list={ROLES}
                    value={role}
                    onChange={setRole}
                  />
                </>
              ) : (
                <>
                  <InputLabel
                    label="Password"
                    pattern="^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$"
                    type="password"
                    className="my-3"
                    onChange={(event) => {
                      if (!staff) return;
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
                    type="password"
                    onChange={(event) => {
                      setConfirmPassword(event.currentTarget.value);
                    }}
                  />
                </>
              )}
            </div>
            <div className="my-4 inline-flex items-center">
              <SelectLabel
                list={MODE}
                value={mode}
                onChange={setMode}
                title="Mode"
              />
              <Link
                to="/staff"
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

export default StaffUpdate;
