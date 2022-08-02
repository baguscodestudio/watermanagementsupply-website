import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatter } from '../../utils';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Paper from '../../components/Paper';

import BillType from '../../type/Bill';
import UserType from '../../type/User';

const BillView = () => {
  const [bill, setBill] = useState<BillType>();
  const [customer, setCustomer] = useState<UserType>();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (bill) {
      axios
        .get(`http://localhost:5000/api/Customer/${bill.customerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((response) => setCustomer(response.data))
        .catch((err) => {
          console.log(err);
          toast.error('Error occured while fetching customer');
        });
    }
  }, [bill]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Bill/${params.billId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setBill(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching Bill');
      });
  }, []);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/Bill/${bill?.billId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        toast(`Successfuly deleted bill ${bill?.billId}`);
        navigate('/bill');
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while deleting bill');
      });
  };

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <Header title="Bill" />
        <div className="w-full flex flex-col py-10 px-12 h-[90vh]">
          <div className="w-1/2 flex flex-col mx-auto">
            <div className="inline-flex w-full items-end">
              <span className="font-semibold text-4xl">{bill?.title}</span>
              <span className="text-sm ml-auto text-gray-500">
                {bill?.billId}
              </span>
            </div>
            <span className="text-gray-500 inline-flex">
              <span className="w-1/6">Created:</span>
              {moment(bill?.createdAt).utc().format('hh:mm:ss A DD/MM/YYYY')}
            </span>
            <span className="text-gray-500 inline-flex">
              <span className="w-1/6">Deadline:</span>
              {moment(bill?.deadline).utc().format('hh:mm:ss A DD/MM/YYYY')}
            </span>
          </div>
          <div className="h-[2px] w-1/2 mx-auto bg-gray-200" />
          <div className="w-2/3 inline-flex mt-12 mx-auto">
            <Paper className="w-5/12 mx-auto px-8 py-4">
              <div className="text-lg">Invoice Information</div>
              <div className="h-[2px] w-full mx-auto bg-gray-200 mb-4" />
              <div className="inline-flex justify-between w-full">
                <span className="font-semibold">Customer Name:</span>
                <span className="">{customer?.username}</span>
              </div>
              <div className="inline-flex justify-between w-full">
                <span className="font-semibold">Month:</span>
                <span className="">{bill?.month}</span>
              </div>
              <div className="inline-flex justify-between w-full">
                <span className="font-semibold">Year:</span>
                <span className="">{bill?.year}</span>
              </div>
              <div className="inline-flex justify-between w-full">
                <span className="font-semibold">Rate:</span>
                <span className="">${bill?.rate}</span>
              </div>
              <div className="inline-flex justify-between w-full">
                <span className="font-semibold">Total Usage:</span>
                <span className="">
                  {bill && formatter.format(bill?.totalUsage)}
                </span>
              </div>
              <div className="inline-flex justify-between w-full mt-12">
                <span className="font-bold">Invoice Amount:</span>
                <span className="text-green-600 font-semibold">
                  $
                  {bill &&
                    formatter.format((bill?.totalUsage * bill?.rate) / 1000)}
                </span>
              </div>
            </Paper>
            {bill?.payment && (
              <Paper className="w-5/12 mx-auto px-8 py-4">
                <div className="text-lg">Payment Information</div>
                <div className="h-[2px] w-full mx-auto bg-gray-200 mb-4" />
                <div className="inline-flex justify-between w-full">
                  <span className="font-bold">Transaction ID:</span>
                  <span className="">{bill?.payment.transactionID}</span>
                </div>
                <div className="inline-flex justify-between w-full">
                  <span className="font-bold">Created At:</span>
                  <span className="">
                    {moment(bill?.payment.createdAt)
                      .utc()
                      .format('hh:mm:ss A DD/MM/YYYY')}
                  </span>
                </div>
                <div className="inline-flex justify-between w-full">
                  <span className="font-bold">Card Information:</span>
                  <span className="">{bill?.payment.cardNumber}</span>
                </div>
              </Paper>
            )}
          </div>
          <div className="inline-flex mx-auto mt-16">
            <Link
              to="/bill"
              className="mx-4 rounded-lg ring-2 ring-gray-800 bg-gray-600 ring-offset-2 text-white px-4 py-1 hover:bg-gray-200 hover:text-black transition-colors"
            >
              Back
            </Link>

            <button
              onClick={handleDelete}
              className="mx-4 rounded-lg ring-2 ring-red-800 bg-red-600 ring-offset-2 text-white px-4 py-1 hover:bg-red-200 hover:text-black transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillView;
