import { Menu } from "@headlessui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "styled-icons/bootstrap";
import { UserContext } from "../App";
import NavBar from "../components/NavBar";
import UserType from "../type/User";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [value, setValue] = useState("");
  const [updatePage, setUpdatePage] = useState("");
  const items = [
    { label: "Email", key: "email" },
    { label: "Password", key: "password" },
    { label: "Phone", key: "phone" },
    { label: "Gender", key: "gender" },
  ];

  const handleUpdate = (
    event: React.FormEvent<HTMLFormElement>,
    key: string
  ) => {
    event.preventDefault();
    axios
      .put(
        `http://localhost:5000/api/Staff/MyInfo/`,
        {
          username: user.username,
          type: user.type,
          updatePassword: key == "password",
          [key]: value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setValue("");
        setUser({ ...user, [key]: value });
        toast("Successfully updated");
      })
      .catch((err) => {
        console.error(err);
        setValue("");
        toast.error("Error occured while updating");
      });
  };

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-44 bg-[#6cb8cf] flex items-center px-12 col-span-2">
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
              {user.staffRole.split(/(?=[A-Z])/).join(" ")}
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
                                  active && "bg-emerald-500 text-white"
                                } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
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
          {updatePage !== "" && (
            <form
              className="bg-neutral-100 w-1/2 shadow-lg flex flex-col py-6 px-10"
              onSubmit={(event) => handleUpdate(event, updatePage)}
            >
              <div className="my-2 inline-flex justify-between">
                <div className="text-lg">
                  {updatePage.charAt(0).toUpperCase() + updatePage.slice(1)}
                </div>
                <input
                  name={updatePage}
                  onChange={(event) => setValue(event.currentTarget.value)}
                  className="ml-6 border-[1px] px-2 border-black bg-transparent"
                />
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
                    setValue("");
                    setUpdatePage("");
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
    </>
  );
};

export default Profile;
