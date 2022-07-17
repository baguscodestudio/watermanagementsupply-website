import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronThinLeft, ChevronThinRight } from 'styled-icons/entypo';
import NavBar from '../../components/NavBar';
import ReportType from '../../type/Report';

const Reports = () => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const rightPage = () => {
    if (page < Math.ceil(reports.length / 10)) setPage(page + 1);
  };
  const leftPage = () => {
    if (page > 0) setPage(page - 1);
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/ReportTicket', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setReports(response.data.result))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching reports');
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#FFC0CB] flex items-center px-12">
          Reports
        </div>
        <div className="w-full flex flex-col">
          <div className="mx-auto mt-16 w-5/6 rounded-lg border-2 border-black">
            <table className="w-full">
              <thead>
                <tr className="h-12 border-b-2 border-black">
                  <th className="w-[15%]">Report Id</th>
                  <th className="w-[15%]">Customer Id</th>
                  <th className="w-[30%]">Title</th>
                  <th className="w-[10%]">Priority</th>
                  <th className="w-[15%]">Created At</th>
                  <th className="w-[15%]">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports
                  .slice(page * 10, page * 10 + 10)
                  .map((report, index) => (
                    <tr
                      className="h-8 hover:cursor-pointer hover:bg-slate-300"
                      onClick={() => navigate(`/reports/${report.reportId}`)}
                    >
                      <td className="px-4">{report.reportId}</td>
                      <td className="px-4">{report.customerId}</td>
                      <td className="text-center">{report.title}</td>
                      <td className="text-center">{report.priority}</td>
                      <td className="text-center">
                        {moment(report.createdAt).format('DD/MM/YYYY')}
                      </td>
                      <td className="text-center">{report.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="inline-flex w-full justify-center mt-4">
            <button
              className="mx-4 hover:font-bold transition-all"
              onClick={leftPage}
            >
              <ChevronThinLeft size="24" /> Back
            </button>
            <button
              className="mx-4 hover:font-bold transition-all"
              onClick={rightPage}
            >
              Next <ChevronThinRight size="24" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
