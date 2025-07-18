import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
        name,
        email,
        password,
        answer,
        phone,
        role
      });

      if (res.data.success) {
        toast.success(res.data.message || "Registration successful!");
        navigate('/login');
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(msg || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4 overflow-hidden">

      <Toaster position="top-center" />
      <div className="inside bg">
        <div className="wrapper">
          <div className="w-full max-w-md bg-pink-100 shadow-2xl rounded-2xl p-8 animate-fade-in-down">
            <h1 className="text-3xl font-bold text-center text-[#242D47] mb-6">Register 📝</h1>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition"
                required
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition"
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
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition"
                required
              />
              <input
                type="text"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role (e.g. Admin(1), Other(0))"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition"
              />
              <input
                type="text"
                name="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="What is your favorite color?"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition"
              />

              <button
                type="submit"
                style={{borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}
                className="w-full bg-[#242D47] text-white py-3 rounded-4xl hover:bg-[#1c2339] transition duration-300 font-semibold mt-2"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
