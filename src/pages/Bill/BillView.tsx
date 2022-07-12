import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import BillType from '../../type/Bill';

const BillView = () => {
  const [bill, setBill] = useState<BillType>();
  const params = useParams();
  const navigate = useNavigate();

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
    <>
      <NavBar />
      <div className="w-full">
        <div className="text-4xl font-bold w-full h-44 bg-[#FFC0CB] flex items-center px-12">
          Bill {bill?.billId}
        </div>
        <div className="w-full flex flex-col">
          <div className="m-auto mt-12 w-1/3 flex flex-col px-12 py-8 rounded-lg border-2 text-lg">
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Bill ID:</span>
              <span className="">{bill?.billId}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Customer ID:</span>
              <span className="">{bill?.customerId}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Month:</span>
              <span className="">{bill?.month}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Year:</span>
              <span className="">{bill?.year}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Rate:</span>
              <span className="">${bill?.rate}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Total Usage:</span>
              <span className="">${bill?.totalUsage}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Title:</span>
              <span className="">{bill?.title}</span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Created At</span>
              <span className="">
                {moment(bill?.createdAt).format('DD/MM/YYYY')}
              </span>
            </div>
            <div className="inline-flex justify-between w-full">
              <span className="font-bold">Created At</span>
              <span className="">
                {moment(bill?.deadline).format('DD/MM/YYYY')}
              </span>
            </div>
            {bill?.payment && (
              <>
                <span className="font-bold">Payment Information:</span>
                <div className="flex flex-col w-1/3 border-2">
                  <div className="inline-flex justify-between w-full">
                    <span className="font-bold">Transaction ID:</span>
                    <span className="">{bill?.payment.transactionID}</span>
                  </div>
                  <div className="inline-flex justify-between w-full">
                    <span className="font-bold">Created At:</span>
                    <span className="">
                      {moment(bill?.payment.createdAt).format('DD/MM/YYYY')}
                    </span>
                  </div>
                  <div className="inline-flex justify-between w-full">
                    <span className="font-bold">Transaction ID:</span>
                    <span className="">{bill?.payment.cardNumber}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="mx-auto mt-16 rounded-lg ring-2 ring-red-800 bg-red-600 ring-offset-2 text-white px-4 py-1 hover:bg-red-200 hover:text-black transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default BillView;
