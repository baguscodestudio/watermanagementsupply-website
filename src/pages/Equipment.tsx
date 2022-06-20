import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import EquipmentType from "../type/Equipment";

const Equipment = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [search, setSearch] = useState("");
  const [finalSearch, setFinalSearch] = useState("");

  const fetchEquipments = () => {
    axios
      .get("http://localhost:5000/api/Equipment/FetchAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setEquipments(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error occured while getting equipments");
      });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFinalSearch(search);
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:5000/api/Equipment/Delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        toast("Successfully deleted Equipment");
        fetchEquipments();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error while deleting equipment");
      });
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-32 bg-[#BC8F8F] flex items-center px-12">
          Equipment
        </div>
        <div className="w-full inline-flex">
          <div className="w-96 ml-24 mt-2">
            <div className="text-xl my-4">Equipment Search</div>
            <form
              onSubmit={(event) => handleSearch(event)}
              className="border-2 border-black w-full items-center inline-flex p-4 justify-between"
            >
              <input
                placeholder="Search for equipment name"
                onChange={(event) => setSearch(event.currentTarget.value)}
                id="search"
                className="border-2 border-black h-8 px-2 py-1"
              />
              <button
                type="submit"
                className="bg-transparent rounded-lg px-4 py-1 border-2 border-black hover:bg-zinc-700 hover:scale-110 transition-all"
              >
                Search
              </button>
            </form>
          </div>
          <div className="flex flex-col mx-auto mt-2">
            <div className="my-4 text-xl">Insert Equipment</div>
            <Link
              to="/equipment/insert"
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
              <th className="border-x-2">Equipment ID</th>
              <th className="border-x-2">Equipment name</th>
              <th className="border-x-2">Installation date</th>
              <th className="border-x-2">Guarantee</th>
              <th className="border-x-2">Replacement period</th>
              <th className="border-x-2">Hardware Specification</th>
              <th className="border-x-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {equipments
              .filter((equipment) =>
                equipment.equipmentName
                  .toLowerCase()
                  .includes(finalSearch.toLowerCase())
              )
              .map((equipment, index) => (
                <tr
                  key={index}
                  className="odd:bg-[#E5E5E5] even:bg-white h-8 text-center"
                >
                  <td>{equipment.equipmentId}</td>
                  <td>{equipment.equipmentName}</td>
                  <td>{new Date(equipment.installationDate).toDateString()}</td>
                  <td>{new Date(equipment.guaranteeDate).toDateString()}</td>
                  <td></td>
                  <td>{equipment.hardwareSpec}</td>
                  <td>
                    <button
                      className="underline underline-offset-2"
                      onClick={() => handleDelete(equipment.equipmentId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Equipment;
