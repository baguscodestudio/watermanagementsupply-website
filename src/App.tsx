import { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';

import ProtectedRoutes from './ProtectedRoutes';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Equipment from './pages/Equipment';
import EquipmentCreate from './pages/EquipmentCreate';
import Chemical from './pages/Chemical';
import ChemicalInsert from './pages/ChemicalInsert';
import BroadcastCreate from './pages/BroadcastCreate';
import ChemicalUpdate from './pages/ChemicalUpdate';
import ManageRole from './pages/ManageRole';
import CustomerAccount from './pages/CustomerAccount';
import CustomerCreate from './pages/CustomerCreate';
import StaffAccount from './pages/StaffAccount';
import StaffCreate from './pages/StaffCreate';
import StaffUpdate from './pages/StaffUpdate';
import Broadcast from './pages/Broadcast';
import WaterPumpUsage from './pages/WaterPumpUsage';
import ViewIndividualPumpUsage from './pages/ViewIndividualPumpUsage';
import WaterUsage from './pages/WaterUsage';
import ViewIndividualWaterUsage from './pages/ViewIndividualWaterUsage';
import Profile from './pages/Profile';
import CustomerUpdate from './pages/CustomerUpdate';

import { Chart, registerables } from 'chart.js';

import UserType from './type/User';
import 'chartjs-adapter-moment';
Chart.register(...registerables);

const userObj = {
  user: {
    userId: '',
    username: '',
    password: '',
    createdAt: '',
    fullName: '',
    gender: 'M',
    email: '',
    phone: '',
    type: '',
    staffRole: '',
  },
  setUser: (user: UserType) => {},
};

export const UserContext = createContext(userObj);

function App() {
  const [user, setUser] = useState(userObj.user);

  return (
    <div className="h-screen flex flex-col">
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
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pumpusage" element={<WaterPumpUsage />} />
              <Route path="/waterusage" element={<WaterUsage />} />
              <Route
                path="/waterusage/:customerId"
                element={<ViewIndividualWaterUsage />}
              />
              <Route
                path="/pumpusage/:pumpId"
                element={<ViewIndividualPumpUsage />}
              />
              <Route path="/staff/role" element={<ManageRole />} />
              <Route path="/staff" element={<StaffAccount />} />
              <Route path="/staff/create" element={<StaffCreate />} />
              <Route path="/staff/update/:staffId" element={<StaffUpdate />} />
              <Route path="/customer" element={<CustomerAccount />} />
              <Route path="/customer/create" element={<CustomerCreate />} />
              <Route
                path="/customer/update/:customerId"
                element={<CustomerUpdate />}
              />
              <Route path="/broadcast" element={<Broadcast />} />
              <Route path="/broadcast/create" element={<BroadcastCreate />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/equipment/insert" element={<EquipmentCreate />} />
              <Route path="/chemical" element={<Chemical />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/chemical/update/:chemicalId"
                element={<ChemicalUpdate />}
              />
              <Route path="/chemical/insert" element={<ChemicalInsert />} />
            </Route>
          </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
