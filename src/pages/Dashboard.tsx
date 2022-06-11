import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser({ username: "" });
    toast("Successfully logged out!");
    navigate("/");
  };

  return (
    <div className="m-auto">
      <div className="font-semibold text-2xl">Welcome, {user.username}</div>
      <button
        onClick={handleLogout}
        className="mx-auto px-4 py-2 bg-neutral-300 hover:bg-neutral-500 hover:text-white transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
