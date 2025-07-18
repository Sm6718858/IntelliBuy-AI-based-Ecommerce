import React from 'react';
import AdminMenu from './AdminMenu';
import { useAuth } from '../../Context/Auth';

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-10 flex-grow">

        <div className="md:w-1/4">
          <div className="bg-white shadow-lg rounded-xl p-4">
            <AdminMenu />
          </div>
        </div>

        <div className="md:w-3/4 w-full">
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center uppercase">
              Admin Profile
            </h2>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                <strong className="text-blue-800 px-3">Name:</strong> {auth?.user?.name}
              </p>
              <p>
                <strong className="text-blue-800 px-3">Email:</strong> {auth?.user?.email}
              </p>
              <p>
                <strong className="text-blue-800 px-3 py-1.5">Phone:</strong> {auth?.user?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default AdminDashboard;
