import axios from "axios";
import React, { FormEventHandler, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/api/Staff/Login", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("userData", JSON.stringify(response.data.user));
          console.log(response.data.user);
          setUser({ ...response.data.user });
          console.log(response);
          toast("Logged in successfully");
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
        toast(err.response.data.message);
      });
  };
  return (
    <form
      className="m-auto text-xl bg-neutral-300 rounded-xl h-1/2 w-1/4 flex flex-col py-10 px-10"
      onSubmit={handleLogin}
    >
      <div className="font-semibold text-2xl underline">Login</div>
      <div className="flex flex-col my-2 w-full">
        <div className="inline-flex w-full my-1">
          <div className="mr-3">Username:</div>{" "}
          <input
            type="text"
            className="ml-auto"
            id="username"
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </div>
        <div className="inline-flex w-full my-1">
          <div className="mr-3">Password:</div>
          <input
            type="password"
            className="ml-auto"
            id="password"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className="mx-auto bg-gray-200 border-2 rounded-lg border-black px-8 my-auto"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
