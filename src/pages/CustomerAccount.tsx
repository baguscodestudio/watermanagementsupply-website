import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import CustomerType from "../type/Customer";

const CustomerAccount = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);

  const fetchCustomers = () => {
    axios
      .get("http://localhost:5000/api/Customer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error occured while getting customers");
      });
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:5000/api/Customer/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        toast("Successfully deleted customer");
        fetchCustomers();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error while deleting customer");
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-44 bg-[#FFFACD] flex items-center px-12">
          Manage Customers
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
            <div className="my-4 text-xl">Create Customer Account</div>
            <Link
              to="/customer/create"
              id="create"
              className="bg-transparent rounded-lg px-4 py-1 border-2 border-black text-center"
            >
              Create
            </Link>
          </div>
        </div>
        <table className="w-full mt-16">
          <thead className="bg-[#00008B] text-white text-lg font-thin h-10">
            <tr>
              <th className="border-x-2">Customer ID</th>
              <th className="border-x-2">Customer username</th>
              <th className="border-x-2">Customer name</th>
              <th className="border-x-2">Gender</th>
              <th className="border-x-2">Phone number</th>
              <th className="border-x-2">Email address</th>
              <th className="border-x-2">Last Maintenance</th>
              <th className="border-x-2">Update</th>
              <th className="border-x-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={index}
                className="odd:bg-[#E5E5E5] even:bg-white h-8 text-center"
              >
                <td>{customer.userId}</td>
                <td>{customer.username}</td>
                <td>{customer.fullName}</td>
                <td>{customer.gender === "M" ? "Male" : "Female"}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{new Date(customer.lastMaintenance).toDateString()}</td>
                <td>
                  <Link
                    to={`/customer/update/${customer.userId}`}
                    className="underline underline-offset-2"
                  >
                    Update
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.userId)}
                    className="underline underline-offset-2"
                  >
                    Delete
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

export default CustomerAccount;
