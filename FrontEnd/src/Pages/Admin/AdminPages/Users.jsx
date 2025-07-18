import React, { useEffect, useState } from 'react';
import AdminMenu from '../AdminMenu';
import axios from 'axios';
import { useAuth } from '../../../Context/Auth';
import toast from 'react-hot-toast';

const Users = () => {
  const [auth] = useAuth();
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/all-users`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      setUsers(data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("❌ Failed to load users");
    }
  };

  useEffect(() => {
    if (auth?.token) getAllUsers();
  }, [auth?.token]);

  const admins = users.filter((u) => u.role === 1);
  const normalUsers = users.filter((u) => u.role !== 1);

  const renderTable = (data, title, badgeColor) => (
    <div className="bg-white shadow-xl rounded-xl p-6 md:p-10 mb-10">
      <h2 className={`text-2xl md:text-3xl font-bold text-${badgeColor}-700 mb-6 text-center uppercase`}>
        {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-center text-gray-600">No {title.toLowerCase()} found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 text-sm md:text-base">
            <thead className={`bg-${badgeColor}-700 text-white`}>
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">
                    {user.role === 1 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Admin
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                        User
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 p-4 md:p-10">
      <div className="flex flex-col md:flex-row gap-6">
      
        <div className="md:w-1/4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <AdminMenu />
          </div>
        </div>

        <div className="md:w-3/4 w-full">
          {renderTable(admins, 'Admins', 'green')}
          {renderTable(normalUsers, 'Users', 'blue')}
        </div>
      </div>
    </div>
  );
};

export default Users;
