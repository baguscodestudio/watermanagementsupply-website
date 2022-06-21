import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

const ChemicalUpdate = () => {
  const [chemical, setChemical] = useState({
    chemicalName: "",
    quantity: 0,
    measureUnit: "",
    usageDescription: "",
  });
  const [previousChemical, setPreviousChemical] = useState({
    chemicalName: "",
    quantity: 0,
    measureUnit: "",
    usageDescription: "",
  });
  const params = useParams();
  const id = params.chemicalId;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Chemical/Fetch/Id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setPreviousChemical(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error occured while getting the chemical information");
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .put(
        "http://localhost:5000/api/Chemical/Update",
        {
          chemicalId: id,
          ...chemical,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        toast("Successfully updated chemical!");
        navigate("/chemical");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error while inserting chemical");
      });
  };

  return (
    <>
      <NavBar />
      <div className="w-full grid grid-cols-2">
        <div className="text-4xl font-bold w-full h-32 bg-[#FFA500] flex items-center px-12 col-span-2">
          Chemical Inventory
        </div>
        <div className="">
          <form
            className="flex flex-col ml-20 mt-24"
            id="chemical-info"
            onSubmit={(event) => handleSubmit(event)}
          >
            <div className="text-2xl mb-14 underline">
              Chemical Inventory Information
            </div>
            <div className="my-2 w-[27rem] inline-flex justify-between">
              <div className="text-lg">Chemical name:</div>
              <input
                name="name"
                onChange={(event) =>
                  setChemical({
                    ...chemical,
                    chemicalName: event.currentTarget.value,
                  })
                }
                className="w-56 border-2 px-2 border-black bg-transparent"
              />
            </div>
            <div className="my-2 w-[27rem] inline-flex justify-between">
              <div className="text-lg">Chemical quantity:</div>
              <input
                type="number"
                onChange={(event) =>
                  setChemical({
                    ...chemical,
                    quantity: parseInt(event.currentTarget.value),
                  })
                }
                name="quantity"
                className="w-56 border-2 px-2 border-black bg-transparent"
              />
            </div>
            <div className="my-2 w-[27rem] inline-flex justify-between">
              <div className="text-lg">Chemical measure unit:</div>
              <input
                name="measure-unit"
                onChange={(event) =>
                  setChemical({
                    ...chemical,
                    measureUnit: event.currentTarget.value,
                  })
                }
                className="w-56 border-2 px-2 border-black bg-transparent "
              />
            </div>
            <div className="my-2 w-[27rem] inline-flex justify-between">
              <div className="text-lg">Chemical usage description:</div>
              <textarea
                name="usage-description"
                onChange={(event) =>
                  setChemical({
                    ...chemical,
                    usageDescription: event.currentTarget.value,
                  })
                }
                rows={5}
                cols={50}
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
                to="/chemical"
                className="rounded-lg border-black bg-transparent border-2 px-4 py-1"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
        <div className="flex flex-col mt-24">
          <div className="mx-auto text-4xl font-bold underline">
            Chemical Inventory
          </div>
          <table className="mt-16 w-4/5 mx-auto">
            <tr className="bg-neutral-100 border-[2px] border-black">
              <th>Previous Inventory</th>
            </tr>
            <tr className="border-[2px] border-black">
              <td className="flex flex-col px-6 py-4">
                <div>
                  <strong>Chemical name: </strong>
                  {previousChemical.chemicalName}
                </div>
                <div>
                  <strong>Chemical quantity: </strong>
                  {previousChemical.quantity}
                </div>
                <div>
                  <strong>Chemical measure: </strong>
                  {previousChemical.measureUnit}
                </div>
                <div>
                  <strong>Chemical usage description: </strong>
                  {previousChemical.usageDescription}
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default ChemicalUpdate;
