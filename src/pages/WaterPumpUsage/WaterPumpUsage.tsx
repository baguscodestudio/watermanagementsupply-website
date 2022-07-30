import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Chart, getDatasetAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import type { InteractionItem } from 'chart.js';
import moment from 'moment';

import { Search } from '@styled-icons/boxicons-regular/Search';

import WaterPumpUsageType from '../../type/WaterPumpUsage';
import EquipmentType from '../../type/Equipment';

import Header from '../../components/Header';
import Pagination from '../../components/Pagination';
import NavBar from '../../components/NavBar';
import Paper from '../../components/Paper';
import InputLabel from '../../components/InputLabel';
import SelectTimeFrameLabel from '../../components/SelectTimeFrameLabel';

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

const WaterPumpUsage = () => {
  const [waterPumpUsages, setWaterPumpUsages] = useState<WaterPumpUsageType[]>(
    []
  );
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [search, setSearch] = useState('');
  const [finalSearch, setFinalSearch] = useState('');
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState(MODES[0]);
  const [selEq, setSelEq] = useState<string[]>([]);
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
    setFinalSearch(search);
  };

  const addSelectedEquipment = (eq: EquipmentType) => {
    if (selEq.includes(eq.equipmentId)) {
      let tempArr = [...selEq];
      tempArr = tempArr.filter((id) => id !== eq.equipmentId);
      setSelEq(tempArr);
    } else if (selEq.length < 5) {
      let tempArr = [...selEq];
      tempArr.push(eq.equipmentId);
      setSelEq(tempArr);
    } else {
      let tempArr = [...selEq];
      tempArr.shift();
      tempArr.push(eq.equipmentId);
      setSelEq(tempArr);
    }
  };

  const getEquipmentName = (id: string) => {
    if (equipments) {
      for (let i = 0; i < equipments.length; i++) {
        if (equipments[i].equipmentId === id) {
          return equipments[i].equipmentName;
        }
      }
    } else {
      return id;
    }
  };

  const fetchEquipments = () => {
    axios
      .get('http://localhost:5000/api/Equipment', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setEquipments(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting equipments');
      });
  };

  const labels: string[] = [];
  waterPumpUsages.map((waterPumpUsage, index) => {
    if (selEq.includes(waterPumpUsage.pumpId)) {
      waterPumpUsage.data.map((sensordata, i) => {
        if (dataValue[waterPumpUsage.pumpId]) {
          dataValue[waterPumpUsage.pumpId].data.push({
            x: moment(sensordata.timestamp),
            y: sensordata.value,
          });
        } else {
          let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
            Math.random() * 255
          )},${Math.floor(Math.random() * 255)})`;
          dataValue[waterPumpUsage.pumpId] = {
            label: getEquipmentName(waterPumpUsage.pumpId),
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
      // console.log(set.data.length);
      set.data.map((data: { x: string; y: number }) => {
        // console.log(
        //   data.y,
        //   data.x,
        //   moment(data.x).format('YYYY-MM-DD'),
        //   currentDate
        // );
        if (
          !currentDate ||
          currentDate !== moment(data.x).format('YYYY-MM-DD')
        ) {
          // console.log(total, count, currentDate);
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
          // console.log(data.y, currentDate);
        } else if (currentDate === moment(data.x).format('YYYY-MM-DD')) {
          // console.log(data.y, currentDate, count);
          total += data.y;
          count++;
        }
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
      set.data = calculated_data;
    }
  });

  const data = {
    labels: labels,
    datasets: Object.keys(dataValue).map((key) => dataValue[key]),
  };

  const onClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;
    let items: InteractionItem[] = getDatasetAtEvent(chart!, event);
    navigate(`/pumpusage/${data.datasets[items[0].datasetIndex].label}`);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/WaterPumpUsage', {
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
        toast.error('An error occured while getting Water Pump Usage');
      });
  }, [previousDateString, currentDateString]);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <Header title="Water Pump Usage" />
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
                placeholder="Search for equipment name"
                onChange={(event) => setSearch(event.currentTarget.value)}
                id="search"
                className="outline-none w-full"
              />
            </form>
            <span className="px-4 text-lg font-semibold">Equipments</span>
            <div className="w-full h-[2px] bg-gray-900 my-2" />
            <table className="w-full text-center">
              <tbody>
                {equipments
                  .filter(
                    (equipment) =>
                      equipment.equipmentName
                        .toLowerCase()
                        .includes(finalSearch.toLowerCase()) &&
                      equipment.type === 'Pump'
                  )
                  .slice(page * 15, page * 15 + 15)
                  .map((equipment, index) => (
                    <tr
                      key={index}
                      onClick={() => addSelectedEquipment(equipment)}
                      className="border-b-2 h-8 border-gray-200 last-of-type:border-none hover:cursor-pointer"
                    >
                      <td className="py-1">
                        <div
                          className={`${
                            selEq.includes(equipment.equipmentId) &&
                            'bg-gray-200 text-gray-500 rounded-lg'
                          }`}
                        >
                          {equipment.equipmentName}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Pagination
              className="mt-auto mx-auto mb-6"
              rows={equipments.length}
              rowsPerPage={15}
              page={page}
              setPage={setPage}
            />
          </div>
          <div className="w-4/5 flex flex-col pl-12">
            <Chart
              ref={chartRef}
              type="line"
              className="h-4/5 mx-auto"
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                  title: {
                    display: true,
                    text: 'All Pump Usage',
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

export default WaterPumpUsage;
