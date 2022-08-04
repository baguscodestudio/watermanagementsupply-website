import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import NavBar from '../../components/NavBar';
import Pagination from '../../components/Pagination';
import Paper from '../../components/Paper';
import WaterRateType from '../../type/WaterRate';

const WaterRate = () => {
  const [waterRates, setWaterRates] = useState<WaterRateType[]>([]);
  const [waterRate, setWaterRate] = useState({
    price: 0,
    month: 0,
    year: 0,
  });
  const [selWaterRate, setSelWaterRate] = useState<WaterRateType>();
  const [page, setPage] = useState(0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selWaterRate?.month === moment().month() + 1) {
      axios
        .put(
          'http://localhost:5000/api/WaterRate',
          {
            ...selWaterRate,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          toast('Successfully updated');
          fetchWaterRates();
        })
        .catch((err) => {
          console.log(err);
          toast.error('An error occured while updating water rates');
        });
    } else {
      toast.error(
        'You can only update the price of the current month water rate!'
      );
    }
  };

  const fetchWaterRates = () => {
    axios
      .get('http://localhost:5000/api/WaterRate/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setWaterRates(response.data.result))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching water rates');
      });
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        `http://localhost:5000/api/WaterRate`,
        {
          ...waterRate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully created new water rate!');
        fetchWaterRates();
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while creating water rate!');
      });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (month !== 0 && year !== 0) {
      axios
        .get(`http://localhost:5000/api/WaterRate/${year}/${month}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((response) => {
          setWaterRates([{ ...response.data }]);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            toast.error('No water rate was found for that month and year!');
          } else {
            console.log(err);
            toast.error(
              'An error occured while fetching water rates for that month & year'
            );
          }
        });
    }
  };

  useEffect(() => {
    fetchWaterRates();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Water Rate List" />
        <div className="flex py-10 px-12 h-[90vh] justify-center">
          <Paper className="w-2/5 px-4 py-2 h-full flex flex-col">
            <span className="font-semibold text-xl">Water Rate History</span>
            <div className="w-full h-[2px] bg-gray-200 my-2" />
            <table className="w-full">
              <thead>
                <tr>
                  <th>Rate</th>
                  <th>Month</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {waterRates
                  .slice(page * 10, page * 10 + 10)
                  .map((waterrate, index) => (
                    <tr
                      key={index}
                      className="h-10 hover:bg-gray-200 hover:text-gray-500 hover:cursor-pointer"
                      onClick={() => setSelWaterRate(waterrate)}
                    >
                      <td className="text-center">${waterrate.price}</td>
                      <td className="text-center">{waterrate.month}</td>
                      <td className="text-center">{waterrate.year}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <form
              className="inline-flex mt-auto mb-4 items-end"
              onSubmit={handleSearch}
            >
              <InputLabel
                className="w-2/5 mr-4"
                label="Month"
                type="number"
                required={true}
                min={1}
                max={12}
                onChange={(event) => {
                  setMonth(parseInt(event.currentTarget.value));
                }}
              />
              <InputLabel
                label="Year"
                className="w-2/5"
                type="number"
                required={true}
                onChange={(event) => {
                  setYear(parseInt(event.currentTarget.value));
                }}
                min={2000}
                max={2100}
              />
              <button
                type="submit"
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
              >
                Search
              </button>
            </form>
            <Pagination
              className="mt-4 ml-auto mb-6"
              page={page}
              setPage={setPage}
              rows={waterRates.length}
              rowsPerPage={10}
            />
          </Paper>
          <div className="w-3/5 px-4 flex flex-col">
            <form onSubmit={handleCreate} className="w-full">
              <Paper className="w-full px-10 py-5 flex flex-col">
                <span className="text-lg font-semibold">Create new Rate</span>
                <InputLabel
                  className="my-2 w-2/5"
                  label="Price"
                  type="number"
                  onChange={(event) => {
                    setWaterRate({
                      ...waterRate,
                      price: parseFloat(event.currentTarget.value),
                    });
                  }}
                  required={true}
                />
                <div className="inline-flex my-2">
                  <InputLabel
                    className="w-2/5 mr-4"
                    label="Month"
                    type="number"
                    required={true}
                    min={1}
                    max={12}
                    onChange={(event) => {
                      setWaterRate({
                        ...waterRate,
                        month: parseInt(event.currentTarget.value),
                      });
                    }}
                  />
                  <InputLabel
                    label="Year"
                    className="w-2/5"
                    type="number"
                    required={true}
                    onChange={(event) => {
                      setWaterRate({
                        ...waterRate,
                        year: parseInt(event.currentTarget.value),
                      });
                    }}
                    min={2000}
                    max={2100}
                  />
                </div>
                <div className="inline-flex my-2 mr-auto">
                  <button
                    type="submit"
                    className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
                  >
                    Create
                  </button>
                </div>
              </Paper>
            </form>
            <form className="w-full" onSubmit={handleUpdate}>
              {selWaterRate && (
                <Paper className="mt-12 px-10 py-4">
                  <span className="text-lg">
                    Water Rate {selWaterRate.waterRateId}
                  </span>
                  <div className="w-full h-[2px] bg-gray-200 my-2" />
                  <div className="inline-flex my-2">
                    <InputLabel
                      label="Month"
                      className="w-1/5 mr-4"
                      value={selWaterRate.month}
                      disabled={true}
                      onChange={() => {}}
                    />
                    <InputLabel
                      label="Year"
                      className="w-1/5"
                      value={selWaterRate.year}
                      disabled={true}
                      onChange={() => {}}
                    />
                  </div>
                  <InputLabel
                    label="Price"
                    className="w-1/5 my-2"
                    value={selWaterRate.price}
                    onChange={(event) => {
                      setSelWaterRate({
                        ...selWaterRate,
                        price: parseFloat(event.currentTarget.value),
                      });
                    }}
                  />
                  <div className="inline-flex my-2 mr-auto">
                    <button
                      type="submit"
                      className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
                    >
                      Update
                    </button>
                  </div>
                </Paper>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterRate;
