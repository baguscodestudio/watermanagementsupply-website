import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

const ManageRole = () => {
  return (
    <>
      <NavBar />
      <div className="w-full flex">
        <div className="mx-auto text-5xl text-lime-600">Manage Role</div>
      </div>
    </>
  );
};

export default ManageRole;
