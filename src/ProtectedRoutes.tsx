import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const useAuth = async () => {
    await axios
      .get("http://localhost:5000/api/TestAuthorization", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAccess(true);
          setLoading(false);
        } else {
          setAccess(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setAccess(false);
        setLoading(false);
      });
  };
  useEffect(() => {
    useAuth();
  }, []);

  return loading ? (
    <div>Loading</div>
  ) : access ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoutes;
