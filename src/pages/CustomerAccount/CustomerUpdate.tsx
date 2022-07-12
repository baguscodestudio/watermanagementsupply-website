import { Listbox, Menu } from '@headlessui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp } from 'styled-icons/bootstrap';
import { CheckmarkOutline } from 'styled-icons/evaicons-outline';
import NavBar from '../../components/NavBar';

const CustomerUpdate = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePage, setUpdatePage] = useState('');
  const [customer, setCustomer] = useState({
    username: '',
    password: '',
    fullName: '',
    gender: 'M',
    email: '',
    phone: '',
    type: 'Customer',
    lastMaintenance: '',
  });
  const params = useParams();
  const id = params.customerId;
  const items = [
    { label: 'Username', key: 'username' },
    { label: 'Full Name', key: 'fullName' },
    { label: 'Email', key: 'email' },
    { label: 'Password', key: 'password' },
    { label: 'Phone', key: 'phone' },
    { label: 'Gender', key: 'gender' },
    { label: 'Last Maintenance', key: 'lastMaintenance' },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Customer/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setCustomer(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting the customer information');
      });
  }, []);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    key: string
  ) => {
    event.preventDefault();
    if (updatePage === 'password' && customer.password !== confirmPassword) {
      toast.error('Password does not match!');
    } else {
      axios
        .put(
          'http://localhost:5000/api/Customer',
          {
            userId: id,
            updatePassword: updatePage === 'password',
            ...customer,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          toast('Successfully updated customer!');
          navigate('/customer');
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error while updating customer');
        });
    }
  };

  return (
    <>
      <NavBar />
      <div className="w-full grid grid-cols-2">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#FFA500] flex items-center px-12 col-span-2">
          Customer
        </div>
        <div className="bg-neutral-100 w-1/2 h-[50vh] shadow-lg flex flex-col py-6 px-10 mt-12 ml-10">
          <div className="inline-flex justify-between w-64 py-2 border-b-2">
            <span>Username:</span>
            <span>{customer.username}</span>
          </div>
          <div className="inline-flex justify-between w-64 py-2 border-b-2">
            <span>Full Name:</span>
            <span>{customer.fullName}</span>
          </div>
          <div className="inline-flex justify-between w-64 py-2 border-b-2">
            <span>Email:</span>
            <span>{customer.email}</span>
          </div>
          <div className="inline-flex justify-between w-64 py-2 border-b-2">
            <span>Phone:</span>
            <span>{customer.phone}</span>
          </div>
          <div className="inline-flex justify-between w-64 py-2 border-b-2">
            <span>Gender:</span>
            <span>{customer.gender}</span>
          </div>
          <div className="inline-flex justify-between w-64 py-2">
            <span>Last Maintenance:</span>
            <span>
              {new Date(customer.lastMaintenance).toLocaleDateString()}
            </span>
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
            className="bg-neutral-100 w-1/2 shadow-lg flex flex-col py-6 px-10 mt-12"
            onSubmit={(event) => handleSubmit(event, updatePage)}
          >
            <div className="my-2 inline-flex justify-between items-center">
              <div className="text-lg">
                {updatePage.charAt(0).toUpperCase() + updatePage.slice(1)}
              </div>
              {updatePage !== 'gender' ? (
                <>
                  <input
                    name={updatePage}
                    pattern={
                      updatePage === 'password'
                        ? '^(?=P{Ll}*p{Ll})(?=P{Lu}*p{Lu})(?=P{N}*p{N})(?=[p{L}p{N}]*[^p{L}p{N}])[sS]{8,}$'
                        : updatePage === 'fullName'
                        ? '^.*[a-zA-Z]+.*$'
                        : ''
                    }
                    type={
                      updatePage === 'lastMaintenance'
                        ? 'date'
                        : updatePage === 'password'
                        ? 'password'
                        : 'text'
                    }
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        [updatePage]:
                          updatePage === 'lastMaintenance'
                            ? new Date(event.currentTarget.value).toISOString()
                            : event.currentTarget.value,
                      })
                    }
                    className="ml-6 border-[1px] px-2 border-black bg-transparent"
                  />
                </>
              ) : (
                <Listbox
                  value={customer.gender}
                  onChange={(value) =>
                    setCustomer({ ...customer, gender: value })
                  }
                >
                  <div className="relative mt-1 w-32">
                    <Listbox.Button className="relative w-full h-10 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
                      {customer.gender}
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
    </>
  );
};

export default CustomerUpdate;
