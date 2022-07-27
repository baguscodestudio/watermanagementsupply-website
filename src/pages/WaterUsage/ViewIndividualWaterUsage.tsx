import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import EquipmentType from '../../type/Equipment';
import WaterUsageType from '../../type/WaterUsage';
import moment from 'moment';

const ViewIndividualWaterUsage = () => {
  const [waterPumpUsages, setWaterPumpUsages] = useState<WaterUsageType[]>([]);
  const [equipment, setEquipment] = useState<EquipmentType>();
  const currentDate = new Date();
  const previousDate = new Date();
  const navigate = useNavigate();
  const params = useParams();
  previousDate.setDate(currentDate.getDate() - 7);
  const [currentDateString, setCurrentDateString] = useState(
    moment().format('YYYY-MM-DD')
  );
  const [previousDateString, setPreviousDateString] = useState(
    moment().add(-7, 'days').format('YYYY-MM-DD')
  );
  const chartRef = useRef<ChartJS>(null);

  const getDaysArray = function (start: string, end: string) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt).toLocaleDateString());
    }
    return arr;
  };

  const labels: string[] = getDaysArray(previousDateString, currentDateString);
  const dataValue: {
    [key: string]: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    };
  } = {};
  waterPumpUsages.map((waterPumpUsage, index) => {
    let total = 0;
    waterPumpUsage.data.map((sensordata, i) => (total += sensordata.value));
    let average = total / waterPumpUsage.data.length;
    if (dataValue[waterPumpUsage.customerId]) {
      dataValue[waterPumpUsage.customerId].data.push(average);
    } else {
      let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)})`;
      dataValue[waterPumpUsage.customerId] = {
        label: waterPumpUsage.customerId,
        data: [average],
        borderColor: color,
        backgroundColor: color,
      };
    }
  });
  const data = {
    labels: labels,
    datasets: Object.keys(dataValue).map((key) => dataValue[key]),
  };

  const options = {
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
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/WaterUsage/${params.customerId}`, {
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
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#FFC0CB] flex items-center px-12">
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
              to="/waterusage"
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
              options={options}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewIndividualWaterUsage;