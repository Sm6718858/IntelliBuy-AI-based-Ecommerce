import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Forgot_Password = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer,setAnswer] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Forgot_Password`, {
                email,
                answer,
                newPassword
            });

            if (res.data.success) {
                toast.success(res.data.message || "Password Reset");
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            const msg = error?.response?.data?.message;
            if (msg) {
                toast.error(msg);
            } else {
                toast.error("Something went wrong. Try again.");
            }
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
            <Toaster position="top-center" />
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6">
                <h2 className="text-3xl font-bold text-center text-[#242D47] mb-6">Reset Password</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                        required
                    />
                    <input
                        type="text"
                        name="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="What is your Recruiter name.."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                        required
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                        required
                    />

                    <button
                        type="submit"
                        style={{ borderBottomLeftRadius:'20px',borderBottomRightRadius:'20px'}}
                        className="w-full bg-[#242D47] text-white py-3 rounded-xl hover:bg-[#1c2339] transition duration-300 font-semibold"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Forgot_Password;

