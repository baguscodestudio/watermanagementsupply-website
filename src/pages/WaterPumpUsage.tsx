import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import WaterPumpUsageType from "../type/WaterPumpUsage";
import { Chart, getDatasetAtEvent } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import type { InteractionItem } from "chart.js";

const WaterPumpUsage = () => {
  const [waterPumpUsages, setWaterPumpUsages] = useState<WaterPumpUsageType[]>(
    []
  );
  const [dataValue, setDataValue] = useState<{
    [key: string]: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    };
  }>({});
  const currentDate = new Date();
  const previousDate = new Date();
  const navigate = useNavigate();
  previousDate.setDate(currentDate.getDate() - 7);
  const [currentDateString, setCurrentDateString] = useState(
    `${currentDate.getFullYear()}-${
      currentDate.getMonth() < 9
        ? `0${currentDate.getMonth() + 1}`
        : currentDate.getMonth() + 1
    }-${
      currentDate.getDate() < 10
        ? `${currentDate.getDate()}`
        : currentDate.getDate()
    }`
  );
  const [previousDateString, setPreviousDateString] = useState(
    `${previousDate.getFullYear()}-${
      previousDate.getMonth() < 9
        ? `0${previousDate.getMonth() + 1}`
        : previousDate.getMonth() + 1
    }-${
      previousDate.getDate() < 10
        ? `${previousDate.getDate()}`
        : previousDate.getDate()
    }`
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
  const getPumpName = async (pumpId: string) => {
    let response = await axios.get(
      `http://localhost:5000/api/Equipment/EquipmentId/${pumpId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data[0].equipmentName;
  };

  const labels: string[] = getDaysArray(previousDateString, currentDateString);
  waterPumpUsages.map((waterPumpUsage, index) => {
    let total = 0;
    waterPumpUsage.data.map((sensordata, i) => (total += sensordata.value));
    let average = total / waterPumpUsage.data.length;
    if (dataValue[waterPumpUsage.pumpId]) {
      dataValue[waterPumpUsage.pumpId].data.push(average);
    } else {
      let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)})`;
      getPumpName(waterPumpUsage.pumpId).then((name) => {
        setDataValue({
          ...dataValue,
          [waterPumpUsage.pumpId]: {
            label: name,
            data: [average],
            borderColor: color,
            backgroundColor: color,
          },
        });
      });
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
        position: "top" as const,
      },
      title: {
        display: true,
        text: "All Pump Usage",
      },
    },
  };

  const onClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;
    let items: InteractionItem[] = getDatasetAtEvent(chart!, event);
    navigate(`/pumpusage/${data.datasets[items[0].datasetIndex].label}`);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/WaterPumpUsage", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params: {
          fromDate: previousDateString,
          toDate: currentDateString,
        },
      })
      .then((response) => setWaterPumpUsages(response.data))
      .catch((err) => {
        console.log(err);
        toast.error("An error occured while getting Water Pump Usage");
      });
  }, []);

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
            <div className=" mt-4 inline-flex w-full justify-around">
              <button className="rounded-lg border-black bg-white border-2 px-4 py-1">
                Yearly
              </button>
              <button className="rounded-lg border-black bg-white border-2 px-4 py-1">
                Monthly
              </button>
              <button className="rounded-lg border-black bg-white border-2 px-4 py-1">
                Weekly
              </button>
            </div>
          </div>
          <div className="w-4/5">
            <Chart
              ref={chartRef}
              type="line"
              className="w-full h-auto"
              data={data}
              options={options}
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WaterPumpUsage;
