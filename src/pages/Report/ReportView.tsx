import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import TextAreaLabel from '../../components/TextAreaLabel';
import ReportType from '../../type/Report';
import moment from 'moment';
import { CircleFill } from 'styled-icons/bootstrap';

const ReportView = () => {
  const [report, setReport] = useState<ReportType>();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REST_URL}/ReportTicket/${params.reportId}`, {
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
        `${import.meta.env.VITE_REST_URL}/ReportTicket`,
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
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full relative">
        <Header title="Report Ticket" />
        <div className="flex flex-col py-10 px-12 h-[90vh] items-center">
          <div className="flex flex-col w-1/2">
            <div className="w-full flex flex-col mb-4">
              <span className="font-semibold text-4xl">{report?.title}</span>
              <span className="text-gray-500 text-sm">{report?.reportId}</span>
              <div className="inline-flex w-full justify-between">
                <span className="text-lg text-gray-500">
                  {moment(report?.createdAt).format('hh:mm:ss A DD/MM/YYYY')}
                </span>
                <span className="text-lg text-gray-500">
                  <CircleFill
                    size="24"
                    className={`${
                      report?.status === 'Closed'
                        ? 'text-red-500'
                        : 'text-emerald-500'
                    }`}
                  />{' '}
                  <span className="font-semibold text-gray-900">
                    {report?.status}
                  </span>
                </span>
              </div>
            </div>
            <TextAreaLabel
              label="Description"
              rows={10}
              value={report?.description}
              className="mb-6 mt-2"
              disabled={true}
              onChange={() => ''}
            />
            <div className="inline-flex mr-auto">
              <Link
                to="/reports"
                className="rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Back
              </Link>
              {report?.status === 'closed' && (
                <button
                  onClick={markResolved}
                  className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-red-500 font-medium text-lg"
                >
                  Mark as resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
