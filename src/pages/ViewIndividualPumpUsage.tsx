import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';
import WaterPumpUsageType from '../type/WaterPumpUsage';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import EquipmentType from '../type/Equipment';
import moment from 'moment';

const ViewIndividualPumpUsage = () => {
  const [waterPumpUsages, setWaterPumpUsages] = useState<WaterPumpUsageType[]>(
    []
  );
  const [equipment, setEquipment] = useState<EquipmentType>();
  const currentDate = new Date();
  const previousDate = new Date();
  const params = useParams();
  previousDate.setDate(currentDate.getDate() - 7);
  const [currentDateString, setCurrentDateString] = useState(
    moment().format('YYYY-MM-DD')
  );
  const [previousDateString, setPreviousDateString] = useState(
    moment().add(-7, 'days').format('YYYY-MM-DD')
  );
  const chartRef = useRef<ChartJS>(null);

  const labels: string[] = [];
  const dataValue: {
    [key: string]: any;
  } = {};
  waterPumpUsages.map((waterPumpUsage, index) => {
    if (waterPumpUsage.pumpId == params.pumpId) {
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
            label: waterPumpUsage.pumpId,
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

  const data = {
    labels: labels,
    datasets: Object.keys(dataValue).map((key) => dataValue[key]),
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Equipment/EquipmentId/${params.pumpId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setEquipment(response.data[0]))
      .catch((err) => toast.error('Error while getting equipment'));
    axios
      .get(`http://localhost:5000/api/WaterPumpUsage/${params.pumpId}`, {
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
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-44 bg-[#FFC0CB] flex items-center px-12">
          Water Pump Usage
        </div>
        <div className="w-full h-screen flex">
          <div className="h-full w-1/5 bg-neutral-300">
            <div className="inline-flex w-full justify-between px-4 mb-2 mt-6">
              <div>From date:</div>
              <input
                onChange={(event) =>
                  setPreviousDateString(event.currentTarget.value)
                }
                value={previousDateString}
                type="date"
                className="w-56 border-2 px-2 border-black"
              />
            </div>
            <div className="inline-flex w-full justify-between px-4 my-2">
              <div>To date:</div>
              <input
                onChange={(event) =>
                  setCurrentDateString(event.currentTarget.value)
                }
                value={currentDateString}
                type="date"
                className="w-56 border-2 px-2 border-black"
              />
            </div>
            <Link
              to="/pumpusage"
              className="rounded-lg border-black bg-white border-2 px-4 py-1 ml-4 mt-4"
            >
              Back
            </Link>
          </div>
          <div className="w-4/5">
            <Chart
              ref={chartRef}
              type="line"
              className="w-full h-auto"
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: equipment?.equipmentName,
                  },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'day',
                      displayFormats: {
                        day: 'DD/MM/YYYY',
                      },
                      tooltipFormat: 'DD MMM YYYY',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewIndividualPumpUsage;
