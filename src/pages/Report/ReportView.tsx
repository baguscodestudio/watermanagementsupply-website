import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import ReportType from '../../type/Report';

const ReportView = () => {
  const [report, setReport] = useState<ReportType>();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/ReportTicket/${params.reportId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setReport(response.data))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while getting the report');
      });
  }, []);

  const markResolved = () => {
    axios
      .put(
        `http://localhost:5000/api/ReportTicket`,
        {
          ...report,
          status: 'Closed',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully closed ticket');
        navigate('/reports');
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while closing the ticket');
      });
  };

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#FFC0CB] flex items-center px-12">
          Reports
        </div>
        <div className="w-full flex flex-col">
          <div className="m-auto mt-12 w-1/3 flex flex-col px-12 py-8 rounded-lg border-2 text-lg">
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Title:</span>
              <span className="">{report?.title}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Customer ID:</span>
              <span className="">{report?.customerId}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Priority:</span>
              <span className="">{report?.priority}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Status:</span>
              <span className="">{report?.status}</span>
            </div>
            <div className="flex flex-col justify-between w-full">
              <span className="font-bold">Description:</span>
              <span className="">{report?.description}</span>
            </div>
          </div>
          <button
            onClick={markResolved}
            className="mx-auto mt-16 rounded-lg ring-2 ring-red-800 bg-red-600 ring-offset-2 text-white px-4 py-1 hover:bg-red-200 hover:text-black transition-colors"
          >
            Mark as Resolved
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportView;
