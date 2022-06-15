import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";

const NavBar = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const paths = [
    { path: "/dashboard", label: "Home" },
    { path: "/user/account", label: "User Account" },
    { path: "/user/role", label: "User Role" },
    { path: "/equipment", label: "Equipment" },
    { path: "/chemical", label: "Chemical Inventory" },
    { path: "/waterusage", label: "Water Usage" },
    { path: "/pumpusage", label: "Water Pump Usage" },
    { path: "/broadcast", label: "Broadcast" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser({ username: "", userId: "", type: "", createdAt: "" });
    toast("Successfully logged out!");
    navigate("/");
  };

  return (
    <nav className="grid grid-cols-9 w-full h-12 text-sm lg:text-base bg-black text-white">
      {paths.map((path, index) => {
        return useLocation().pathname === path.path ? (
          <Link
            className="flex items-center justify-center border-x-[1px] border-white bg-[#0e6e4b]"
            to={path.path}
            key={index}
          >
            {path.label}
          </Link>
        ) : (
          <Link
            className="flex items-center justify-center border-x-[1px] border-white hover:bg-[#0e6e4b]"
            to={path.path}
            key={index}
          >
            {path.label}
          </Link>
        );
      })}
      <button
        className="flex items-center justify-center border-x-[1px] border-white bg-[#04AA6D] hover:bg-[#0e6e4b]"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
