import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/Auth';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        email,
        password,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Login successful!");

        // Update context and localStorage
        setAuth({
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem('auth', JSON.stringify({
          user: res.data.user,
          token: res.data.token,
        }));

        navigate(location.state || '/home');
      } else {
        toast.error(res.data.message || "Login failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-pink-100 shadow-2xl rounded-2xl p-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-center text-[#242D47] mb-6">Login 👋</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-4 py-3 border text-black  border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition"
            required
          />

          <button
            type="button"
            onClick={() => navigate('/Forgot_Password')}
            className="w-full text-sm text-blue-600 hover:underline text-right"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            style={{borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}
            className="w-full bg-[#242D47] text-white py-3 rounded-4xl hover:bg-[#1c2339] transition duration-300 font-semibold mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
