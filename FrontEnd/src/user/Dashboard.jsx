import React from 'react';
import UserMenu from './UserMenu';
import { useAuth } from '../Context/Auth';

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 p-4 md:p-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <UserMenu />
          </div>
        </div>

        <div className="md:w-3/4 w-full">
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-center uppercase">
              User Dashboard
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p><span className="font-semibold text-gray-800 px-4">Name:</span> {auth?.user?.name}</p>
              <p><span className="font-semibold text-gray-800 px-4">Email:</span> {auth?.user?.email}</p>
              <p><span className="font-semibold text-gray-800 px-4 py-3">Phone:</span> {auth?.user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
