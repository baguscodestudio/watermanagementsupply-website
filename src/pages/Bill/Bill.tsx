import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronThinLeft, ChevronThinRight } from 'styled-icons/entypo';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import BillType from '../../type/Bill';

const Bill = () => {
  const [bills, setBills] = useState<BillType[]>([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const rightPage = () => {
    if (page < Math.ceil(bills.length / 10)) setPage(page + 1);
  };
  const leftPage = () => {
    if (page > 0) setPage(page - 1);
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/Bill', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setBills(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occurred while fetching bills');
      });
  }, []);

  const generateBill = () => {
    axios
      .post(
        'http://localhost:5000/api/Bill/GenerateBills',
        {
          month: moment().utc().month(),
          year: moment().utc().year(),
          deadline: moment().utc().add(1, 'month').format('YYYY-MM-DD'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast(
          `Successfully generated bills for every customer for ${moment()
            .utc()
            .format('MMMM')}`
        );
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while generating bills');
      });
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-full">
        <Header title="Bills" />
        <div className="w-full flex flex-col h-[80vh]">
          <div className="w-5/6 mx-auto mt-4 border-black border-2 rounded-xl overflow-clip">
            <table className="w-full">
              <thead>
                <tr className="h-10 border-b-2 border-black">
                  <th>Customer ID</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Title</th>
                  <th>Created</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.slice(page * 10, page * 10 + 10).map((bill, index) => (
                  <tr
                    className="h-10 hover:cursor-pointer hover:bg-slate-300"
                    onClick={() => navigate(`/bill/${bill.billId}`)}
                  >
                    <td className="px-4">{bill.customerId}</td>
                    <td className="text-center">{bill.month}</td>
                    <td className="text-center">{bill.year}</td>
                    <td className="text-center">${bill.rate}</td>
                    <td className="text-center">
                      $
                      {Math.round((bill.rate * bill.totalUsage * 100) / 1000) /
                        100}
                    </td>
                    <td className="text-center">{bill.title}</td>
                    <td className="text-center">
                      {moment(bill.createdAt).utc().format('DD/MM/YYYY')}
                    </td>
                    <td className="text-center">
                      {moment(bill.deadline).utc().format('DD/MM/YYYY')}
                    </td>
                    <td className="text-center">
                      {bill.payment ? (
                        <div className="mx-auto px-4 py-1 rounded-xl bg-lime-500 text-white w-1/2">
                          Paid
                        </div>
                      ) : (
                        <button className="w-1/2 px-4 py-1 rounded-xl bg-red-500 text-white hover:bg-red-300 transition-colors">
                          Unpaid
                        </button>
                      )}
                    </td>
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
          <div className="mt-auto mb-24 mx-auto flex flex-col">
            <span className="mb-4 font-semibold">
              Generate Bills for every customer for{' '}
              {moment().utc().format('MMMM')}
            </span>
            <button
              onClick={generateBill}
              className="ring-offset-2 ring-blue-800 ring-2 bg-blue-600 text-white rounded-lg px-4 py-1 hover:bg-blue-200 hover:text-black"
            >
              Generate Bills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
