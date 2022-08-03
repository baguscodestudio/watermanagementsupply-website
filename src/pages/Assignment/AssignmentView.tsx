import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../App';

import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import ComboboxLabel from '../../components/ComboboxLabel';
import InputLabel from '../../components/InputLabel';
import TextAreaLabel from '../../components/TextAreaLabel';

import CustomerType from '../../type/Customer';
import EquipmentType from '../../type/Equipment';
import UserType from '../../type/User';
import AssignmentType from '../../type/Assignment';
import moment from 'moment';

const AssignmentView = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [staffs, setStaffs] = useState<UserType[]>([]);
  const [task, setTask] = useState<AssignmentType>();
  const [prevTask, setPrevTask] = useState<AssignmentType>();
  const [selEq, setSelEq] = useState('');
  const [selCust, setSelCust] = useState('');
  const [selStaff, setSelStaff] = useState('');
  const [queryStaff, setQueryStaff] = useState('');
  const [queryCust, setQueryCust] = useState('');
  const [queryEq, setQueryEq] = useState('');
  const { user } = useContext(UserContext);
  const params = useParams();

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
        fetchCustomers();
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while getting equipments');
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/TaskAssignment/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        navigate('/assignment');
        toast('Successfully deleted assignment');
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while deleting assignment');
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
        setStaffs(response.data.result);
        setSelStaff(response.data.result[0].username);
        fetchEquipments();
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching staffs');
      });
  };

  const checkChanges = () => {
    return (
      prevTask === task &&
      getIdFromName(selCust, 'customer') === task?.customerId &&
      getIdFromName(selStaff, 'staff') === task?.staffId &&
      getIdFromName(selEq, 'equipment') === task?.equipmentId
    );
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
        axios
          .get(`http://localhost:5000/api/TaskAssignment/${params.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
          .then((response) => {
            setTask(response.data);
            setPrevTask(response.data);
          })
          .catch((err) => {
            toast.error('An error occured while getting the task');
            console.log(err);
          });
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
        .put(
          `http://localhost:5000/api/TaskAssignment/`,
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
    let customer = customers.find(
      (customer) => customer.userId === task?.customerId
    )?.username;
    let equipment = equipments.find(
      (eq) => eq.equipmentId === task?.equipmentId
    )?.equipmentName;
    setSelCust(customer ? customer : '');
    setSelEq(equipment ? equipment : '');
  }, [task, customers, equipments]);

  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
    <div className="w-full h-full flex">
      <NavBar />
      <div className="w-[85vw] h-full">
        <Header title="Assignment View or Update" />
        <div className="w-full flex py-10 px-12 h-[90vh]">
          <form className="w-1/2 flex flex-col" onSubmit={handleSubmit}>
            <InputLabel
              label="Task Name"
              className="my-2"
              value={task?.taskName}
              onChange={(event) => {
                if (!task) return;
                setTask({ ...task, taskName: event.currentTarget.value });
              }}
              required={true}
            />
            <TextAreaLabel
              className="my-2"
              value={task?.taskDesc}
              label="Task Description"
              onChange={(event) => {
                if (!task) return;
                setTask({ ...task, taskDesc: event.currentTarget.value });
              }}
            />
            <InputLabel
              label="Deadline"
              className="w-fit my-2"
              value={moment(task?.deadline).format('YYYY-MM-DDTHH:mm:ss')}
              type="datetime-local"
              onChange={(event) => {
                if (!task) return;
                setTask({ ...task, deadline: event.currentTarget.value });
              }}
            />
            <InputLabel
              label="Finished At"
              className="w-fit my-2"
              value={moment(task?.finishedAt).format('YYYY-MM-DDTHH:mm:ss')}
              type="datetime-local"
              onChange={(event) => {
                if (!task) return;
                setTask({ ...task, finishedAt: event.currentTarget.value });
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
              value={task?.comment}
              onChange={(event) => {
                if (!task) return;
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
                type="button"
                onClick={handleDelete}
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-red-500 font-medium text-lg"
              >
                Delete
              </button>
              <button
                type="submit"
                disabled={checkChanges()}
                className="disabled:bg-gray-300 rounded-lg px-4 h-fit py-1 ml-2 enabled:hover:shadow-lg enabled:hover:-translate-y-1 transition-all text-white bg-green-500 font-medium text-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentView;
