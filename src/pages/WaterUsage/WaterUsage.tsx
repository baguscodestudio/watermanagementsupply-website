import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import { Chart, getDatasetAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import type { InteractionItem } from 'chart.js';
import WaterUsageType from '../../type/WaterUsage';
import moment from 'moment';

const WaterUsage = () => {
  const [waterPumpUsages, setWaterPumpUsages] = useState<WaterUsageType[]>([]);
  const navigate = useNavigate();
  const [currentDateString, setCurrentDateString] = useState(
    moment().format('YYYY-MM-DD')
  );
  const [previousDateString, setPreviousDateString] = useState(
    moment().add(-7, 'days').format('YYYY-MM-DD')
  );
  const chartRef = useRef<ChartJS>(null);

  const dataValue: { [key: string]: any } = {};

  const labels: string[] = [];
  waterPumpUsages.map((waterPumpUsage, index) => {
    let total = 0;
    waterPumpUsage.data.map((sensordata, i) => (total += sensordata.value));
    let average = total / waterPumpUsage.data.length;
    if (dataValue[waterPumpUsage.customerId]) {
      dataValue[waterPumpUsage.customerId].data.push({
        x: moment(waterPumpUsage.date),
        y: average,
      });
    } else {
      let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)})`;
      dataValue[waterPumpUsage.customerId] = {
        label: waterPumpUsage.customerId,
        data: [
          {
            x: moment(waterPumpUsage.date),
            y: average,
          },
        ],
        borderColor: color,
        backgroundColor: color,
      };
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
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#FFC0CB] flex items-center px-12">
          Customer Water Usage
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
            <div className=" mt-4 inline-flex w-full justify-around">
              <button
                onClick={() =>
                  setPreviousDateString(
                    moment().startOf('year').format('YYYY-MM-DD')
                  )
                }
                className="rounded-lg border-black bg-white border-2 px-4 py-1"
              >
                This Year
              </button>
              <button
                onClick={() =>
                  setPreviousDateString(
                    moment().startOf('month').format('YYYY-MM-DD')
                  )
                }
                className="rounded-lg border-black bg-white border-2 px-4 py-1"
              >
                This Month
              </button>
              <button
                onClick={() =>
                  setPreviousDateString(
                    moment().startOf('week').format('YYYY-MM-DD')
                  )
                }
                className="rounded-lg border-black bg-white border-2 px-4 py-1"
              >
                This Week
              </button>
            </div>
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
                    text: 'All Customer Water Usage',
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
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WaterUsage;
