import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { Menu } from "@headlessui/react";

import { BellFill } from "@styled-icons/bootstrap/BellFill";
import { User } from "@styled-icons/boxicons-solid/User";
import { TriangleUp } from "@styled-icons/entypo/TriangleUp";
import { TriangleDown } from "@styled-icons/entypo/TriangleDown";
const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const paths = [
    { path: "/dashboard", label: "Home" },
    // { path: "/user/account", label: "User Account" },
    // { path: "/user/role", label: "User Role" },
    // { path: "/equipment", label: "Equipment" },
    // { path: "/chemical", label: "Chemical Inventory" },
    // { path: "/waterusage", label: "Water Usage" },
    // { path: "/pumpusage", label: "Water Pump Usage" },
    // { path: "/broadcast", label: "Broadcast" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    setUser({ username: "", userId: "", type: "", createdAt: "" });
    toast("Successfully logged out!");
    navigate("/");
  };

  return (
    <nav className="inline-flex w-full items-center h-12 text-sm lg:text-base bg-black text-white">
      {paths.map((path, index) => {
        return useLocation().pathname === path.path ? (
          <Link
            className="flex items-center mx-4 justify-center text-[#0e6e4b]"
            to={path.path}
            key={index}
          >
            {path.label}
          </Link>
        ) : (
          <Link
            className="flex items-center mx-4 justify-center hover:text-[#0e6e4b]"
            to={path.path}
            key={index}
          >
            {path.label}
          </Link>
        );
      })}
      <Menu as="div" className="relative h-full">
        {({ open }) => (
          <>
            <Menu.Button className="h-full flex items-center mx-4 justify-center hover:text-[#0e6e4b]">
              {open ? (
                <div>
                  User <TriangleDown size="16" />
                </div>
              ) : (
                <div>
                  User <TriangleUp size="16" />
                </div>
              )}
            </Menu.Button>
            <Menu.Items className="absolute origin-top-left bg-white text-left text-black rounded-b-md">
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
                      to="/customer"
                    >
                      Customer Account
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
                      to="/staff"
                    >
                      Staff Account
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
                      to="/staff/role"
                    >
                      Staff Role
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
      <Menu as="div" className="relative h-full">
        {({ open }) => (
          <>
            <Menu.Button className="h-full flex items-center mx-4 justify-center hover:text-[#0e6e4b]">
              {open ? (
                <div>
                  Assets <TriangleDown size="16" />
                </div>
              ) : (
                <div>
                  Assets <TriangleUp size="16" />
                </div>
              )}
            </Menu.Button>
            <Menu.Items className="absolute origin-top-left bg-white text-left text-black rounded-b-md">
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
                      to="/equipment"
                    >
                      Equipment
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
                      to="/Chemical"
                    >
                      Chemical Inventory
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
      <Menu as="div" className="relative h-full">
        {({ open }) => (
          <>
            <Menu.Button className="h-full flex items-center mx-4 justify-center hover:text-[#0e6e4b]">
              {open ? (
                <div>
                  Usage <TriangleDown size="16" />
                </div>
              ) : (
                <div>
                  Usage <TriangleUp size="16" />
                </div>
              )}
            </Menu.Button>
            <Menu.Items className="absolute origin-top-left bg-white text-left text-black rounded-b-md">
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
                      to="/pumpusage"
                    >
                      Water Pump Usage
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
                      to="/waterusage"
                    >
                      Water Usage
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
      {useLocation().pathname === "/broadcast" ? (
        <Link
          className="flex items-center mx-4 justify-center text-[#0e6e4b]"
          to="/broadcast"
        >
          Broadcast
        </Link>
      ) : (
        <Link
          className="flex items-center mx-4 justify-center hover:text-[#0e6e4b]"
          to="/broadcast"
        >
          Broadcast
        </Link>
      )}
      <BellFill size="16" className="ml-auto mr-2" />
      <Menu as="div" className="relative h-full mx-2">
        {({ open }) => (
          <>
            <Menu.Button className="h-full flex items-center mx-4 justify-center hover:text-[#0e6e4b]">
              {/* {open ? (
                <div className="inline-flex items-center">
                  Usage <TriangleDown size="16" />
                </div>
              ) : (
                <div className="inline-flex items-center">
                  Usage <TriangleUp size="16" />
                </div>
              )} */}
              <User size="16" />
            </Menu.Button>
            <Menu.Items className="absolute origin-top-right right-0 bg-white text-black rounded-b-md">
              <div className="p-1">
                <Menu.Item>
                  <div
                    className={`flex px-2 w-32 py-1 divide-y divide-gray-100 rounded-sm`}
                  >
                    {user.username}
                  </div>
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 w-32 py-1 divide-y divide-gray-100 rounded-sm`}
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    </nav>
  );
};

export default NavBar;
