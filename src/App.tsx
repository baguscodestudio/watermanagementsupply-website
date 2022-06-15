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
              <Route path="/broadcast" element={<BroadcastCreate />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/equipment/insert" element={<EquipmentCreate />} />
              <Route path="/chemical" element={<Chemical />} />
              <Route path="/chemical/insert" element={<ChemicalInsert />} />
            </Route>
          </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
