import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

const BroadcastCreate = () => {
  const [broadcast, setBroadcast] = useState({
    alertTitle: "",
    alertDescription: "",
    // createdAt: new Date().toISOString(),
  });

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:5000/api/BroadcastAlert/Insert",
        {
          ...broadcast,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        toast("Successfully announced broadcast!");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error while announcing broadcast");
      });
  };

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-32 bg-[#FA8072] flex items-center px-12">
          Broadcast Alert
        </div>
        <form
          className="flex flex-col ml-20 mt-24"
          id="broadcast-info"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="text-2xl mb-14 underline">Broadcast details</div>
          {/* <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Date:</div>
            <input
              name="date"
              disabled
              value={new Date().toISOString()}
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div> */}
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Title:</div>
            <input
              onChange={(event) =>
                setBroadcast({
                  ...broadcast,
                  alertTitle: event.currentTarget.value,
                })
              }
              name="alert-title"
              className="w-56 border-2 px-2 border-black bg-transparent"
            />
          </div>
          <div className="my-2 w-[27rem] inline-flex justify-between">
            <div className="text-lg">Message:</div>
            <textarea
              name="message"
              rows={6}
              cols={75}
              onChange={(event) =>
                setBroadcast({
                  ...broadcast,
                  alertDescription: event.currentTarget.value,
                })
              }
              className="w-56 border-2 px-2 border-black bg-transparent "
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
              to="/"
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

export default BroadcastCreate;
