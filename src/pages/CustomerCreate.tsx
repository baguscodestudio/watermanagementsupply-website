import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

const CustomerCreate = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [customer, setCustomer] = useState({
    username: "",
    password: "",
    fullName: "",
    gender: "M",
    email: "",
    phone: "",
    type: "Customer",
  });

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (customer.password !== confirmPassword) {
      toast.error("Password does not match!");
    } else {
      axios
        .post(
          "http://localhost:5000/api/Customer",
          {
            ...customer,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((response) => {
          toast("Successfully created customer!");
          navigate("/customer");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error while inserting customer");
        });
    }
  };

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-32 bg-[#D8BFD8] flex items-center px-12">
          Customer
        </div>
        <form
          className="flex flex-col ml-20 mt-24"
          id="customer-info"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="text-2xl mb-14 underline">Personal Information</div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Username:</div>
            <input
              name="username"
              onChange={(event) =>
                setCustomer({
                  ...customer,
                  username: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Name:</div>
            <input
              name="full-name"
              onChange={(event) =>
                setCustomer({
                  ...customer,
                  fullName: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Gender:</div>
            <div className="inline-flex w-56 justify-start">
              <div className="mr-2">
                <input
                  type="radio"
                  name="gender"
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      gender: "M",
                    })
                  }
                  className="mr-2"
                />
                Male
              </div>
              <div className="mr-2">
                <input
                  type="radio"
                  name="gender"
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      gender: "F",
                    })
                  }
                  className="mr-2"
                />
                Female
              </div>
            </div>
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Password:</div>
            <input
              type="password"
              onChange={(event) =>
                setCustomer({
                  ...customer,
                  password: event.currentTarget.value,
                })
              }
              name="password"
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Confirm password:</div>
            <input
              type="password"
              onChange={(event) =>
                setConfirmPassword(event.currentTarget.value)
              }
              name="password-confirm"
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Phone number:</div>
            <input
              name="phone-number"
              onChange={(event) =>
                setCustomer({
                  ...customer,
                  phone: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent "
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Email:</div>
            <input
              name="email"
              type="email"
              onChange={(event) =>
                setCustomer({
                  ...customer,
                  email: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent disabled:bg-neutral-100"
            />
          </div>
          <div className="inline-flex mt-16">
            <button
              type="submit"
              className="rounded-lg border-black bg-transparent border-2 px-4 py-1 mr-12"
            >
              Submit
            </button>
            <Link
              to="/customer"
              className="rounded-lg border-black bg-transparent border-2 px-4 py-1"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomerCreate;
