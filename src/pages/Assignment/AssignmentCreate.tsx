import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import ComboboxLabel from '../../components/ComboboxLabel';
import InputLabel from '../../components/InputLabel';
import TextAreaLabel from '../../components/TextAreaLabel';

import CustomerType from '../../type/Customer';
import EquipmentType from '../../type/Equipment';
import UserType from '../../type/User';

const AssignmentCreate = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [staffs, setStaffs] = useState<UserType[]>([]);
  const [task, setTask] = useState({
    taskName: '',
    taskDesc: '',
    deadline: '',
    comment: '',
  });
  const [selEq, setSelEq] = useState('');
  const [selCust, setSelCust] = useState('');
  const [selStaff, setSelStaff] = useState('');
  const [queryStaff, setQueryStaff] = useState('');
  const [queryCust, setQueryCust] = useState('');
  const [queryEq, setQueryEq] = useState('');
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const filteredStaff =
    queryStaff === ''
      ? staffs.map((staff) => staff.username)
      : staffs
          .filter((staff) =>
            staff.username.toLowerCase().includes(queryStaff.toLowerCase())
          )
          .map((staff) => staff.username);

  const filteredCust =
    queryCust === ''
      ? customers.map((customer) => customer.username)
      : customers
          .filter((customer) =>
            customer.username.toLowerCase().includes(queryCust.toLowerCase())
          )
          .map((customer) => customer.username);

  const filteredEq =
    queryEq === ''
      ? equipments.map((eq) => eq.equipmentName)
      : equipments
          .filter((eq) =>
            eq.equipmentName.toLowerCase().includes(queryEq.toLowerCase())
          )
          .map((eq) => eq.equipmentName);

  const getIdFromName = (name: string, type: string) => {
    if (type === 'customer') {
      return customers.find((customer) => customer.username === name)?.userId;
    } else if (type === 'staff') {
      return staffs.find((staff) => staff.username === name)?.userId;
    } else if (type === 'equipment') {
      return equipments.find((eq) => eq.equipmentName === name)?.equipmentId;
    }
  };

  const fetchEquipments = () => {
    axios
      .get('http://localhost:5000/api/Equipment', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setEquipments(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while getting equipments');
      });
  };

  const fetchStaffs = () => {
    axios
      .get('http://localhost:5000/api/Staff', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        let staffArr = response.data.result.filter(
          (staff: UserType) => staff.staffRole !== 'UserAdmin'
        );
        setStaffs([...staffArr]);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching staffs');
      });
  };

  const fetchCustomers = () => {
    axios
      .get('http://localhost:5000/api/Customer', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setCustomers(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting customers');
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selStaff !== '') {
      axios
        .post(
          'http://localhost:5000/api/TaskAssignment',
          {
            ...task,
            managerId: user.userId,
            customerId:
              selCust !== '' ? getIdFromName(selCust, 'customer') : null,
            staffId: getIdFromName(selStaff, 'staff'),
            equipmentId:
              selEq !== '' ? getIdFromName(selEq, 'equipment') : null,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          toast('Successfully created task');
          navigate('/assignment');
        })
        .catch((err) => {
          toast.error('An error occured while submitting task');
          console.log(err);
        });
    } else {
      toast.error('Please select a staff first!');
    }
  };

  useEffect(() => {
    fetchStaffs();
    fetchEquipments();
    fetchCustomers();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <Header title="Assignment Create" />
        <div className="w-full flex py-10 px-12 h-[90vh]">
          <form className="w-1/2 flex flex-col" onSubmit={handleSubmit}>
            <InputLabel
              label="Task Name"
              className="my-2"
              onChange={(event) => {
                setTask({ ...task, taskName: event.currentTarget.value });
              }}
              required={true}
            />
            <TextAreaLabel
              className="my-2"
              label="Task Description"
              onChange={(event) => {
                setTask({ ...task, taskDesc: event.currentTarget.value });
              }}
            />
            <InputLabel
              label="Deadline"
              className="w-fit my-2"
              type="datetime-local"
              onChange={(event) => {
                setTask({ ...task, deadline: event.currentTarget.value });
              }}
            />
            <ComboboxLabel
              className="w-56 my-2"
              title="Staff Assigned"
              required={true}
              setSelected={setSelStaff}
              selected={selStaff}
              setQuery={setQueryStaff}
              filtered={filteredStaff}
            />
            <ComboboxLabel
              className="w-56 my-2"
              title="Customer Assigned"
              setSelected={setSelCust}
              selected={selCust}
              setQuery={setQueryCust}
              filtered={filteredCust}
            />
            <ComboboxLabel
              className="w-56 my-2"
              title="Equipment Assigned"
              setSelected={setSelEq}
              selected={selEq}
              setQuery={setQueryEq}
              filtered={filteredEq}
            />
            <InputLabel
              label="Comment"
              className="my-2"
              onChange={(event) => {
                setTask({ ...task, comment: event.currentTarget.value });
              }}
            />
            <div className="my-4 inline-flex">
              <Link
                to="/assignment"
                className="rounded-lg border-gray-500 text-gray-500 bg-transparent border-2 px-4 py-1 h-fit my-auto ml-auto hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCreate;
