import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Chart, getDatasetAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import type { InteractionItem } from 'chart.js';
import moment from 'moment';

import { Search } from '@styled-icons/boxicons-regular/Search';

import WaterUsageType from '../../type/WaterUsage';
import CustomerType from '../../type/Customer';

import NavBar from '../../components/NavBar';
import Paper from '../../components/Paper';
import InputLabel from '../../components/InputLabel';
import SelectTimeFrameLabel from '../../components/SelectTimeFrameLabel';
import Header from '../../components/Header';
import Pagination from '../../components/Pagination';

const MODES: {
  label: string;
  unit: 'day' | 'month' | 'week' | 'hour';
}[] = [
  {
    label: 'Daily',
    unit: 'day',
  },
  {
    label: 'Monthly',
    unit: 'month',
  },
  {
    label: 'Weekly',
    unit: 'week',
  },
  {
    label: 'Hourly',
    unit: 'hour',
  },
];

const WaterUsage = () => {
  const [waterPumpUsages, setWaterPumpUsages] = useState<WaterUsageType[]>([]);
  const [selCust, setSelCust] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState(MODES[0]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [currentDateString, setCurrentDateString] = useState(
    moment().format('YYYY-MM-DD')
  );
  const [previousDateString, setPreviousDateString] = useState(
    moment().add(-7, 'days').format('YYYY-MM-DD')
  );

  const chartRef = useRef<ChartJS>(null);

  const navigate = useNavigate();
  const dataValue: { [key: string]: any } = {};

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search !== '') {
      axios
        .get('http://localhost:5000/api/Customer/Search', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: search,
          },
        })
        .then((response) => {
          setCustomers(response.data.result);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error occured while searching for customers');
        });
    } else fetchCustomers();
  };

  const addSelectedCustomer = (cust: CustomerType) => {
    if (selCust.includes(cust.userId)) {
      let tempArr = [...selCust];
      tempArr = tempArr.filter((id) => id !== cust.userId);
      setSelCust(tempArr);
    } else if (selCust.length < 5) {
      let tempArr = [...selCust];
      tempArr.push(cust.userId);
      setSelCust(tempArr);
    } else {
      let tempArr = [...selCust];
      tempArr.shift();
      tempArr.push(cust.userId);
      setSelCust(tempArr);
    }
  };

  const fetchCustomers = () => {
    axios
      .get('http://localhost:5000/api/Customer', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setCustomers(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while fetching customers');
      });
  };

  const getCustomerName = (id: string) => {
    if (customers) {
      for (let i = 0; i < customers.length; i++) {
        if (customers[i].userId === id) {
          return customers[i].username;
        }
      }
    } else {
      return id;
    }
  };

  const labels: string[] = [];
  waterPumpUsages.map((waterPumpUsage, index) => {
    if (selCust.includes(waterPumpUsage.customerId)) {
      waterPumpUsage.data.map((sensordata, i) => {
        if (dataValue[waterPumpUsage.customerId]) {
          dataValue[waterPumpUsage.customerId].data.push({
            x: moment(sensordata.timestamp),
            y: sensordata.value,
          });
        } else {
          let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
            Math.random() * 255
          )},${Math.floor(Math.random() * 255)})`;
          dataValue[waterPumpUsage.customerId] = {
            label: getCustomerName(waterPumpUsage.customerId),
            data: [
              {
                x: moment(sensordata.timestamp),
                y: sensordata.value,
              },
            ],
            borderColor: color,
            backgroundColor: color,
          };
        }
      });
    }
  });

  Object.keys(dataValue).map((key) => {
    let set = dataValue[key];
    if (mode.unit === 'day') {
      let total = 0;
      let count = 0;
      let currentDate: string;
      let calculated_data: { x: string; y: number }[] = [];
      set.data.map((data: { x: string; y: number }) => {
        if (
          !currentDate ||
          currentDate !== moment(data.x).format('YYYY-MM-DD')
        ) {
          if (currentDate) {
            calculated_data.push({
              x: currentDate,
              y: total / count,
            });
          }
          currentDate = moment(data.x).format('YYYY-MM-DD');
          total = 0;
          count = 0;
          count++;
          total += data.y;
        } else if (currentDate === moment(data.x).format('YYYY-MM-DD')) {
          total += data.y;
          count++;
        }
      });
      calculated_data.push({
        x: currentDate!,
        y: total / count,
      });
      set.data = calculated_data;
    } else if (mode.unit === 'month') {
      let total = 0;
      let count = 0;
      let currentDate: string;
      let calculated_data: { x: string; y: number }[] = [];
      set.data.map((data: { x: string; y: number }) => {
        if (!currentDate || currentDate !== moment(data.x).format('YYYY-MM')) {
          if (currentDate) {
            calculated_data.push({
              x: currentDate,
              y: total / count,
            });
          }
          currentDate = moment(data.x).format('YYYY-MM');
          total = 0;
          count = 0;
          count++;
          total += data.y;
        } else if (currentDate === moment(data.x).format('YYYY-MM')) {
          total += data.y;
          count++;
        }
      });
      calculated_data.push({
        x: currentDate!,
        y: total / count,
      });
      set.data = calculated_data;
    } else if (mode.unit === 'hour') {
      let total = 0;
      let count = 0;
      let currentDate: string;
      let calculated_data: { x: string; y: number }[] = [];
      set.data.map((data: { x: string; y: number }) => {
        if (
          !currentDate ||
          currentDate !== moment(data.x).format('YYYY-MM-DD HH')
        ) {
          if (currentDate) {
            calculated_data.push({
              x: currentDate,
              y: total / count,
            });
          }
          currentDate = moment(data.x).format('YYYY-MM-DD HH');
          total = 0;
          count = 0;
          count++;
          total += data.y;
        } else if (currentDate === moment(data.x).format('YYYY-MM-DD HH')) {
          total += data.y;
          count++;
        }
      });
      calculated_data.push({
        x: currentDate!,
        y: total / count,
      });
      set.data = calculated_data;
    } else if (mode.unit === 'week') {
      let total = 0;
      let count = 0;
      let currentDate: string;
      let calculated_data: { x: string; y: number }[] = [];
      set.data.map((data: { x: string; y: number }) => {
        if (
          !currentDate ||
          moment(currentDate).week() !== moment(data.x).week()
        ) {
          if (currentDate) {
            calculated_data.push({
              x: moment(currentDate).startOf('week').format('YYYY-MM-DD'),
              y: total / count,
            });
          }
          currentDate = moment(data.x).format('YYYY-MM-DD');
          total = 0;
          count = 0;
          count++;
          total += data.y;
        } else if (moment(currentDate).week() === moment(data.x).week()) {
          total += data.y;
          count++;
        }
      });
      calculated_data.push({
        x: moment(currentDate!).startOf('week').format('YYYY-MM-DD'),
        y: total / count,
      });
      set.data = calculated_data;
    }
  });

  const data = {
    labels: labels,
    datasets: Object.keys(dataValue).map((key) => dataValue[key]),
  };

  const onClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;
    if (!chart) {
      return;
    }
    let items: InteractionItem[] = getDatasetAtEvent(chart, event);
    navigate(`/waterusage/${data.datasets[items[0].datasetIndex].label}`);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/WaterUsage', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          fromDate: previousDateString,
          toDate: currentDateString,
        },
      })
      .then((response) => setWaterPumpUsages(response.data))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while getting Water Usage');
      });
  }, [previousDateString, currentDateString]);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <Header title="Customer Water Usage" />
        <div className="w-full flex py-10 px-12 h-[90vh]">
          <div className="h-full w-1/5 rounded-lg shadow-xl p-4 flex flex-col">
            <form
              onSubmit={(event) => handleSearch(event)}
              className="rounded-lg ring-1 ring-gray-500 w-full h-8 my-4 inline-flex items-center px-2"
            >
              <button
                type="submit"
                className="mr-4 hover:bg-gray-500 hover:text-white rounded-full w-6 h-6 flex transition-colors"
              >
                <Search size="16" className="m-auto" />
              </button>
              <input
                placeholder="Search for customer's name"
                onChange={(event) => setSearch(event.currentTarget.value)}
                id="search"
                className="outline-none w-full"
              />
            </form>
            <span className="px-4 text-lg font-semibold">Customers</span>
            <div className="w-full h-[2px] bg-gray-900 my-2" />
            <table className="w-full text-center">
              <tbody>
                {customers
                  .slice(page * 15, page * 15 + 15)
                  .map((customer, index) => (
                    <tr
                      key={index}
                      onClick={() => addSelectedCustomer(customer)}
                      className="border-b-2 h-8 border-gray-200 last-of-type:border-none hover:cursor-pointer"
                    >
                      <td className="py-1">
                        <div
                          className={`${
                            selCust.includes(customer.userId) &&
                            'bg-gray-200 text-gray-500 rounded-lg'
                          }`}
                        >
                          {customer.username}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Pagination
              className="mt-auto mx-auto mb-6"
              rows={customers.length}
              rowsPerPage={15}
              page={page}
              setPage={setPage}
            />
          </div>
          <div className="w-4/5 flex flex-col pl-12">
            <Chart
              ref={chartRef}
              type="line"
              className="w-full h-auto"
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                  title: {
                    display: true,
                    text: 'All Customer Water Usage (L)',
                  },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: mode.unit,
                      tooltipFormat: 'DD MMM YYYY',
                    },
                  },
                },
              }}
              onClick={onClick}
            />
            <Paper className="w-full h-1/5 px-8 py-2 flex">
              <div className="flex flex-col mr-4">
                <InputLabel
                  className="mb-2"
                  type="date"
                  label="From"
                  onChange={(event) =>
                    setPreviousDateString(event.currentTarget.value)
                  }
                  value={previousDateString}
                />
                <InputLabel
                  type="date"
                  label="To"
                  onChange={(event) =>
                    setCurrentDateString(event.currentTarget.value)
                  }
                  value={currentDateString}
                />
              </div>
              <div>
                <SelectTimeFrameLabel
                  value={mode}
                  onChange={setMode}
                  list={MODES}
                />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterUsage;
