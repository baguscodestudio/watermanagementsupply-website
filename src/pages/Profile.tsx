import { Listbox, Menu } from '@headlessui/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CheckmarkOutline } from '@styled-icons/evaicons-outline/CheckmarkOutline';
import { ChevronDown, ChevronUp } from 'styled-icons/bootstrap';
import { UserContext } from '../App';
import NavBar from '../components/NavBar';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [value, setValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePage, setUpdatePage] = useState('');
  const items = [
    { label: 'Full Name', key: 'fullName' },
    { label: 'Email', key: 'email' },
    { label: 'Password', key: 'password' },
    { label: 'Phone', key: 'phone' },
    { label: 'Gender', key: 'gender' },
  ];

  const handleUpdate = (
    event: React.FormEvent<HTMLFormElement>,
    key: string
  ) => {
    event.preventDefault();
    if (updatePage === 'password' && value !== confirmPassword) {
      toast.error('Your new password and confirm password does not match!');
    } else {
      axios
        .put(
          `http://localhost:5000/api/Staff/MyInfo/`,
          {
            ...user,
            updatePassword: key == 'password',
            [key]: value,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          setValue('');
          if (key === 'gender') {
            setUser({ ...user, gender: value === 'M' ? 'M' : 'F' });
          } else {
            // @ts-ignore
            setUser({ ...user, [key]: value });
          }
          toast('Successfully updated');
        })
        .catch((err) => {
          console.error(err);
          setValue('');
          toast.error('Error occured while updating');
        });
    }
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#6cb8cf] flex items-center px-12 col-span-2">
          Profile
        </div>
        <div className="ml-10 mt-4 bg-neutral-100 shadow-lg w-1/3 h-32 px-10 flex items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-medium">{user.username}</span>
            <span className="text-neutral-600 text-lg">{user.fullName}</span>
          </div>
          <div className="w-0.5 bg-neutral-300 h-16 ml-12 mr-12" />
          <div className="flex flex-col">
            <span className="text-xl font-medium">Role</span>
            <span className="text-neutral-600 text-lg">
              {user.staffRole.split(/(?=[A-Z])/).join(' ')}
            </span>
          </div>
        </div>
        <div className="w-full mt-6 px-10 grid grid-cols-2">
          <div className="bg-neutral-100 w-1/2 h-[50vh] shadow-lg flex flex-col py-6 px-10">
            <div className="inline-flex justify-between w-64 py-2 border-b-2">
              <span>Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="inline-flex justify-between w-64 py-2 border-b-2">
              <span>Phone:</span>
              <span>{user.phone}</span>
            </div>
            <div className="inline-flex justify-between w-64 py-2 border-b-2">
              <span>Account created:</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="inline-flex justify-between w-64 py-2">
              <span>Gender:</span>
              <span>{user.gender}</span>
            </div>
            <Menu as="div" className="relative mt-12">
              {({ open }) => (
                <>
                  <Menu.Button className="h-full flex items-center px-4 py-1 justify-center hover:text-[#0e6e4b] bg-cyan-500 rounded-sm">
                    {open ? (
                      <>
                        Update <ChevronDown size="16" />
                      </>
                    ) : (
                      <>
                        Update <ChevronUp size="16" />
                      </>
                    )}
                  </Menu.Button>
                  <Menu.Items className="absolute origin-top-left bg-white text-left text-black rounded-b-md">
                    <div className="p-1">
                      {items.map((item, index) => {
                        return (
                          <Menu.Item key={index}>
                            {({ active }) => (
                              <button
                                onClick={() => setUpdatePage(item.key)}
                                className={`${
                                  active && 'bg-emerald-500 text-white'
                                } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm text-left`}
                              >
                                {item.label}
                              </button>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </div>
                  </Menu.Items>
                </>
              )}
            </Menu>
          </div>
          {updatePage !== '' && (
            <form
              className="bg-neutral-100 w-1/2 shadow-lg flex flex-col py-6 px-10"
              onSubmit={(event) => handleUpdate(event, updatePage)}
            >
              <div className="my-2 inline-flex justify-between items-center">
                <div className="text-lg">
                  {updatePage.charAt(0).toUpperCase() + updatePage.slice(1)}
                </div>
                {updatePage !== 'gender' ? (
                  <>
                    <input
                      type={updatePage === 'password' ? 'password' : 'text'}
                      name={updatePage}
                      onChange={(event) => setValue(event.currentTarget.value)}
                      className="ml-6 border-[1px] px-2 border-black bg-transparent"
                    />
                  </>
                ) : (
                  <Listbox value={value} onChange={setValue}>
                    <div className="relative mt-1 w-32">
                      <Listbox.Button className="relative w-full h-10 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
                        {value}
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDown
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <Listbox.Option
                          value="M"
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                M
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckmarkOutline
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        <Listbox.Option
                          value="F"
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                F
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckmarkOutline
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      </Listbox.Options>
                    </div>
                  </Listbox>
                )}
              </div>
              <div className="my-2 inline-flex justify-between">
                {updatePage == 'password' && (
                  <>
                    <div className="text-lg">Confirm Password</div>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="ml-6 border-[1px] px-2 border-black bg-transparent"
                      onChange={(event) =>
                        setConfirmPassword(event.currentTarget.value)
                      }
                    />
                  </>
                )}
              </div>
              <div className="inline-flex mt-16">
                <button
                  type="submit"
                  className="rounded-lg border-black bg-transparent border-2 px-4 py-1 mr-12"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setValue('');
                    setUpdatePage('');
                  }}
                  className="rounded-lg border-black bg-transparent border-2 px-4 py-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
