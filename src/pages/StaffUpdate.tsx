import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

const StaffUpdate = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [staff, setStaff] = useState({
    username: "",
    password: "",
    fullName: "",
    gender: "M",
    email: "",
    phone: "",
    type: "Staff",
    staffRole: "",
  });
  const params = useParams();
  const id = params.staffId;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Staff/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setStaff(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error occured while getting the staff information");
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (staff.password !== confirmPassword) {
      toast.error("Password does not match!");
    } else {
      axios
        .put(
          "http://localhost:5000/api/Staff",
          {
            userId: id,
            ...staff,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((response) => {
          toast("Successfully updated staff!");
          navigate("/staff");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error while inserting staff");
        });
    }
  };

  return (
    <>
      <NavBar />
      <div className="w-full grid grid-cols-2">
        <div className="text-4xl font-bold w-full h-44 bg-[#FFA500] flex items-center px-12 col-span-2">
          Staff
        </div>
        <div className="">
          <form
            className="flex flex-col ml-20 mt-24"
            id="chemical-info"
            onSubmit={(event) => handleSubmit(event)}
          >
            <div className="text-2xl mb-14 underline">Staff Information</div>
            <div className="my-2 w-[27rem] inline-flex justify-between">
              <div className="text-lg">Username:</div>
              <input
                name="username"
                value={staff.username}
                onChange={(event) =>
                  setStaff({
                    ...staff,
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
                value={staff.fullName}
                onChange={(event) =>
                  setStaff({
                    ...staff,
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
                      setStaff({
                        ...staff,
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
                      setStaff({
                        ...staff,
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
                pattern="^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$"
                onChange={(event) =>
                  setStaff({
                    ...staff,
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
                value={staff.phone}
                onChange={(event) =>
                  setStaff({
                    ...staff,
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
                value={staff.email}
                type="email"
                onChange={(event) =>
                  setStaff({
                    ...staff,
                    email: event.currentTarget.value,
                  })
                }
                className="w-56 border-2 px-2 border-black bg-transparent disabled:bg-neutral-100"
              />
            </div>
            <div className="my-2 w-[27rem] inline-flex justify-between">
              <div className="text-lg">Staff Role:</div>
              <input
                name="staffRole"
                value={staff.staffRole}
                onChange={(event) =>
                  setStaff({
                    ...staff,
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
                to="/staff"
                className="rounded-lg border-black bg-transparent border-2 px-4 py-1"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StaffUpdate;
