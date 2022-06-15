import { useContext } from "react";
import { UserContext } from "../App";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div
      className="w-full h-full bg-contain flex flex-col bg-center"
      style={{ backgroundImage: "url(images/dashboard.png)" }}
    >
      <NavBar />
      <div className="m-auto">
        <div className="font-semibold text-5xl">
          Welcome {user.type}, {user.username}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
