import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/Auth';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const AdminRoute = () => {
  const [auth] = useAuth();
  const [ok, setOk] = useState(null); 

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin-auth-protected`);
        setOk(res.data.ok);
      } catch (err) {
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setOk(false);
    }
  }, [auth?.token]);

  if (ok === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-600">
        Loading...
      </div>
    );
  }

  return ok ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
