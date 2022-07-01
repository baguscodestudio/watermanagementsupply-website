import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { Menu } from "@headlessui/react";

import { BellFill } from "@styled-icons/bootstrap/BellFill";
import { User } from "@styled-icons/boxicons-solid/User";

import LinkList from "./LinkList";
const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const paths = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/broadcast", label: "Broadcast", roles: ["CustomerSupport"] },
  ];
  const LINK_LIST = [
    {
      title: "User",
      roles: ["CustomerSupport", "UserAdmin"],
      items: [
        {
          roles: ["CustomerSupport"],
          label: "Customer Account",
          path: "/customer",
        },
        {
          roles: ["UserAdmin"],
          label: "Staff Account",
          path: "/staff",
        },
        {
          roles: ["UserAdmin"],
          label: "Staff Role",
          path: "/staff/role",
        },
      ],
    },
    {
      title: "User",
      roles: ["Technician"],
      items: [
        {
          roles: ["Technician"],
          label: "Equipment",
          path: "/equipment",
        },
        {
          roles: ["Technician"],
          label: "Chemical Inventory",
          path: "/chemical",
        },
      ],
    },
    {
      title: "Usage",
      roles: ["Technician", "CustomerSupport"],
      items: [
        {
          roles: ["Technician"],
          label: "Water Pump Usage",
          path: "/pumpusage",
        },
        {
          roles: ["Technician", "CustomerSupport"],
          label: "Water Usage",
          path: "/waterusage",
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    setUser({
      userId: "",
      username: "",
      password: "",
      createdAt: "",
      fullName: "",
      gender: "M",
      email: "",
      phone: "",
      type: "",
      staffRole: "",
    });
    toast("Successfully logged out!");
    navigate("/");
  };

  return (
    <nav className="inline-flex absolute top-0 w-full items-center h-12 text-sm lg:text-base bg-black text-white">
      {paths.map((path, index) => {
        if ((path.roles && path.roles.includes(user.staffRole)) || !path.roles)
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
      {LINK_LIST.map((list, index) => (
        <LinkList
          key={index}
          title={list.title}
          items={list.items}
          roles={list.roles}
        />
      ))}
      <BellFill size="16" className="ml-auto mr-2" />
      <Menu as="div" className="relative h-full mx-2">
        {({ open }) => (
          <>
            <Menu.Button className="h-full flex items-center mx-4 justify-center hover:text-[#0e6e4b]">
              <User size="16" />
            </Menu.Button>
            <Menu.Items className="absolute origin-top-right right-0 bg-white text-black rounded-b-md min-h-fit">
              <div className="py-1 px-2">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`${
                        active && "bg-emerald-500 text-white"
                      } flex px-2 w-32 py-1 divide-y divide-gray-100 rounded-sm`}
                    >
                      {user.username}
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  <div
                    className={`flex px-2 w-32 py-1 divide-y divide-gray-100 rounded-sm`}
                  >
                    {user.staffRole}
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
