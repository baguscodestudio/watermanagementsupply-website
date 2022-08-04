import { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './App.css';

import ProtectedRoutes from './ProtectedRoutes';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Equipment from './pages/Equipment/Equipment';
import EquipmentCreate from './pages/Equipment/EquipmentCreate';
import EquipmentView from './pages/Equipment/EquipmentView';
import Chemical from './pages/Chemical/Chemical';
import ChemicalInsert from './pages/Chemical/ChemicalInsert';
import BroadcastCreate from './pages/Broadcast/BroadcastCreate';
import ChemicalUpdate from './pages/Chemical/ChemicalUpdate';
import ManageRole from './pages/ManageRole';
import CustomerAccount from './pages/CustomerAccount/CustomerAccount';
import CustomerCreate from './pages/CustomerAccount/CustomerCreate';
import StaffAccount from './pages/StaffAccount/StaffAccount';
import StaffCreate from './pages/StaffAccount/StaffCreate';
import StaffUpdate from './pages/StaffAccount/StaffUpdate';
import Broadcast from './pages/Broadcast/Broadcast';
import BroadcastView from './pages/Broadcast/BroadcastView';
import WaterPumpUsage from './pages/WaterPumpUsage/WaterPumpUsage';
import ChemicalUsage from './pages/ChemicalUsage/ChemicalUsage';
import WaterUsage from './pages/WaterUsage/WaterUsage';
import Profile from './pages/Profile';
import ProfilePassword from './pages/ProfilePassword';
import CustomerUpdate from './pages/CustomerAccount/CustomerUpdate';
import Bill from './pages/Bill/Bill';
import BillView from './pages/Bill/BillView';
import Reports from './pages/Report/Reports';
import ReportView from './pages/Report/ReportView';
import Assignment from './pages/Assignment/Assignment';
import AssignmentCreate from './pages/Assignment/AssignmentCreate';
import AssignmentSelf from './pages/Assignment/AssignmentSelf';
import AssignmentView from './pages/Assignment/AssignmentView';
import Maintenance from './pages/Maintenance/Maintenance';
import MaintenanceCreate from './pages/Maintenance/MaintenanceCreate';

import { Chart, registerables } from 'chart.js';

import UserType from './type/User';
import 'chartjs-adapter-moment';
import NotificationType from './type/Notification';
import axios from 'axios';
import MaintenanceView from './pages/Maintenance/MaintenanceView';
import WaterRate from './pages/WaterRate/WaterRate';

Chart.register(...registerables);

const userObj: UserContextValue = {
  user: {} as UserType,
  setUser: (user: UserType) => {},
};

interface UserContextValue {
  user: UserType;
  setUser: (user: UserType) => void;
}

interface NotificationContextValue {
  notifications: NotificationType[];
  setNotifications: (data: NotificationType[]) => void;
}

const notificationObj: NotificationContextValue = {
  notifications: [],
  setNotifications: (data) => {},
};

export const UserContext = createContext(userObj);
export const NotificationContext = createContext(notificationObj);

function App() {
  const [user, setUser] = useState<UserType>(userObj.user);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (user.staffRole === 'Technician') {
      axios
        .get('http://localhost:5000/api/Notification', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((response) => {
          setNotifications(response.data.result);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error while getting notifications');
        });
    }
  }, [user.staffRole]);

  return (
    <div className="min-h-screen flex flex-col font-inter text-gray-900">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      {/* Same as */}
      <ToastContainer />
      <Router>
        <UserContext.Provider value={{ user, setUser }}>
          <NotificationContext.Provider
            value={{ notifications, setNotifications }}
          >
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pumpusage" element={<WaterPumpUsage />} />
                <Route path="/waterusage" element={<WaterUsage />} />
                <Route path="/chemicalusage" element={<ChemicalUsage />} />
                <Route path="/assignment" element={<Assignment />} />
                <Route
                  path="/assignment/create"
                  element={<AssignmentCreate />}
                />
                <Route path="/assignment/:id" element={<AssignmentView />} />
                <Route path="/assignment/self" element={<AssignmentSelf />} />
                <Route path="/staff/role" element={<ManageRole />} />
                <Route path="/staff" element={<StaffAccount />} />
                <Route path="/staff/create" element={<StaffCreate />} />
                <Route path="/staff/:staffId" element={<StaffUpdate />} />
                <Route path="/customer" element={<CustomerAccount />} />
                <Route path="/customer/create" element={<CustomerCreate />} />
                <Route
                  path="/customer/:customerId"
                  element={<CustomerUpdate />}
                />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route
                  path="/maintenance/create"
                  element={<MaintenanceCreate />}
                />
                <Route path="/maintenance/:id" element={<MaintenanceView />} />
                <Route path="/waterrate" element={<WaterRate />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/reports/:reportId" element={<ReportView />} />
                <Route path="/bill" element={<Bill />} />
                <Route path="/bill/:billId" element={<BillView />} />
                <Route path="/broadcast" element={<Broadcast />} />
                <Route path="/broadcast/:id" element={<BroadcastView />} />
                <Route path="/broadcast/create" element={<BroadcastCreate />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route
                  path="/equipment/:equipmentId"
                  element={<EquipmentView />}
                />
                <Route path="/equipment/insert" element={<EquipmentCreate />} />
                <Route path="/chemical" element={<Chemical />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/password" element={<ProfilePassword />} />
                <Route
                  path="/chemical/:chemicalId"
                  element={<ChemicalUpdate />}
                />
                <Route path="/chemical/insert" element={<ChemicalInsert />} />
              </Route>
            </Routes>
          </NotificationContext.Provider>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
