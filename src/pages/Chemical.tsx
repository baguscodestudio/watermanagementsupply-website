import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import ChecmicalType from "../type/Chemical";

const Chemical = () => {
  const [chemicals, setChemicals] = useState<ChecmicalType[]>([]);

  const fetchChemicals = () => {
    axios
      .get("http://localhost:5000/api/Chemical/FetchAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setChemicals(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error occured while getting chemicals");
      });
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:5000/api/Chemical/Delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        toast("Successfully deleted chemical");
        fetchChemicals();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error while deleting chemical");
      });
  };

  useEffect(() => {
    fetchChemicals();
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-32 bg-[#8FBC8F] flex items-center px-12">
          Chemical Inventory
        </div>
        <div className="w-full inline-flex">
          {/* <div className="w-96 ml-24 mt-2">
            <div className="text-xl my-4">Chemical Search</div>
            <div className="border-2 border-black w-full items-center inline-flex p-4 justify-between">
              <input
                placeholder="Search for equipment name"
                className="border-2 border-black h-8 px-2 py-1"
              />
              <button
                id="search"
                className="bg-transparent rounded-lg px-4 py-1 border-2 border-black"
              >
                Search
              </button>
            </div>
          </div> */}
          <div className="flex flex-col mx-auto mt-2">
            <div className="my-4 text-xl">Insert chemical inventory</div>
            <Link
              to="/chemical/insert"
              id="insert"
              className="bg-transparent rounded-lg px-4 py-1 border-2 border-black text-center"
            >
              Insert
            </Link>
          </div>
        </div>
        <table className="w-full mt-16">
          <thead className="bg-[#00008B] text-white text-lg font-thin h-10">
            <tr>
              <th className="border-x-2">Chemical ID</th>
              <th className="border-x-2">Chemical name</th>
              <th className="border-x-2">Chemical quantity</th>
              <th className="border-x-2">Chemical measure</th>
              <th className="border-x-2">Chemical usage description</th>
              <th className="border-x-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {chemicals.map((chemical, index) => (
              <tr
                key={index}
                className="odd:bg-[#E5E5E5] even:bg-white h-8 text-center"
              >
                <td>{chemical.chemicalId}</td>
                <td>{chemical.chemicalName}</td>
                <td>{chemical.quantity}</td>
                <td>{chemical.measureUnit}</td>
                <td>{chemical.usageDescription}</td>
                <td>
                  <Link
                    to={`/chemical/update/${chemical.chemicalId}`}
                    className="underline underline-offset-2"
                  >
                    Update
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Chemical;
