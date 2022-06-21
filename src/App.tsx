import axios from "axios";
import { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import "react-toastify/dist/ReactToastify.css";

import Equipment from "./pages/Equipment";
import EquipmentCreate from "./pages/EquipmentCreate";
import Chemical from "./pages/Chemical";
import ChemicalInsert from "./pages/ChemicalInsert";
import BroadcastCreate from "./pages/BroadcastCreate";
import ChemicalUpdate from "./pages/ChemicalUpdate";
import ManageRole from "./pages/ManageRole";
import CustomerAccount from "./pages/CustomerAccount";
import CustomerCreate from "./pages/CustomerCreate";
import StaffAccount from "./pages/StaffAccount";
import StaffCreate from "./pages/StaffCreate";

export interface User {
  username: string;
  type: string;
  userId: string;
  createdAt: string;
}

const userObj = {
  user: { username: "", type: "", userId: "", createdAt: "" },
  setUser: (user: User) => {},
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
              <Route path="/staff/role" element={<ManageRole />} />
              <Route path="/staff" element={<StaffAccount />} />
              <Route path="/staff/create" element={<StaffCreate />} />
              <Route path="/customer" element={<CustomerAccount />} />
              <Route path="/customer/create" element={<CustomerCreate />} />
              <Route path="/broadcast" element={<BroadcastCreate />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/equipment/insert" element={<EquipmentCreate />} />
              <Route path="/chemical" element={<Chemical />} />
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
