import React, { useState, useEffect } from "react";
import UserMenu from "../UserMenu";
import { useAuth } from "../../Context/Auth";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard/user";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const { email, name, phone, address } = auth?.user || {};
    setName(name || "");
    setPhone(phone || "");
    setEmail(email || "");
    setAddress(address || "");
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
        { name, email, password, phone, address },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data.updatedUser });

        let ls = JSON.parse(localStorage.getItem("auth"));
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));

        toast.success("✅ Profile Updated Successfully");
        navigate(from);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 p-4 md:p-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="bg-white shadow-md rounded-xl p-4">
            <UserMenu />
          </div>
        </div>

        <div className="md:w-3/4 w-full">
          <div className="bg-white shadow-lg rounded-xl p-6 md:p-10">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center uppercase">
              Update Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" className="w-full px-4 py-2 border rounded-md" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" className="w-full px-4 py-2 border rounded-md bg-gray-100" value={email} disabled />
              <input type="password" className="w-full px-4 py-2 border rounded-md" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <input type="text" className="w-full px-4 py-2 border rounded-md" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <input type="text" className="w-full px-4 py-2 border rounded-md" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              <div className="text-center">
                <button style={{borderRadius: '5px', minWidth:'80px', marginTop:'20px', marginBottom:'10px'}} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition">
                  UPDATE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
