import axios from 'axios';
import React, { FormEventHandler, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../App';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(`${import.meta.env.VITE_REST_URL}/Staff/Login`, {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('accessToken', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data.user));
          console.log(response.data.user);
          setUser({ ...response.data.user });
          console.log(response);
          toast('Logged in successfully');
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        console.log(err);
        toast(err.response.data.message);
      });
  };
  return (
    <form
      className="m-auto 2xl:text-xl bg-gray-200 shadow-lg rounded-xl h-[30vh] w-1/2 2xl:w-1/4 flex flex-col py-4 px-8 2xl:p-10"
      onSubmit={handleLogin}
    >
      <div className="font-semibold 2xl:text-2xl underline">Login</div>
      <div className="flex flex-col my-2 w-full">
        <div className="inline-flex w-full my-1">
          <div className="">Username:</div>{' '}
          <input
            type="text"
            className="ml-auto"
            id="username"
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </div>
        <div className="inline-flex w-full my-1">
          <div className="">Password:</div>
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
        className="mx-auto bg-gray-200 border-2 rounded-lg border-black px-8 mt-auto mb-8"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
