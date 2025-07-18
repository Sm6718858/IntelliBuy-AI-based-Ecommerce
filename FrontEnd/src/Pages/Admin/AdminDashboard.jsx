import React, { useState, useEffect } from 'react';
import AdminMenu from './AdminMenu';
import { useAuth } from '../../Context/Auth';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/all-orders`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`
          }
        });

        console.log('Full API Response:', res.data);

        if (!res.data || !res.data.success || !Array.isArray(res.data.orders)) {
          throw new Error('Invalid data format received from API');
        }

        if (res.data.orders.length === 0) {
          console.warn('No orders found in response');
        }

        const processedData = processOrderData(res.data.orders);
        console.log('Processed Chart Data:', processedData);
        setAnalyticsData(processedData);
        
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load order data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [auth?.token]);

  const processOrderData = (orders) => {
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    months.forEach(month => {
      monthlyData[month] = {
        name: month,
        orders: 0,
        revenue: 0
      };
    });

    orders.forEach(order => {
      try {
        const dateStr = order.createdAt || order.orderDate || order.date;
        if (!dateStr) {
          console.warn('Order missing date field:', order);
          return;
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date format:', dateStr);
          return;
        }

        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        const amount = parseFloat(order.totalAmount || order.amount || order.price || 0);
        
        monthlyData[monthName].orders += 1;
        monthlyData[monthName].revenue += amount;
        
      } catch (err) {
        console.error('Error processing order:', order, err);
      }
    });

    return Object.values(monthlyData);
  };

  const defaultData = [
    { name: 'Jan', orders: 0, revenue: 0 },
    { name: 'Feb', orders: 0, revenue: 0 },
    { name: 'Mar', orders: 0, revenue: 0 },
    { name: 'Apr', orders: 0, revenue: 0 },
    { name: 'May', orders: 0, revenue: 0 },
    { name: 'Jun', orders: 0, revenue: 0 },
    { name: 'Jul', orders: 0, revenue: 0 },
    { name: 'Aug', orders: 0, revenue: 0 },
    { name: 'Sep', orders: 0, revenue: 0 },
    { name: 'Oct', orders: 0, revenue: 0 },
    { name: 'Nov', orders: 0, revenue: 0 },
    { name: 'Dec', orders: 0, revenue: 0 },
  ];

  const chartData = loading || error || analyticsData.length === 0 ? defaultData : analyticsData;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-10 flex-grow">
        <div className="md:w-1/4">
          <div className="bg-white shadow-lg rounded-xl p-4">
            <AdminMenu />
          </div>
        </div>

        <div className="md:w-3/4 w-full">
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-10 mb-6">
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

          <div className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center uppercase">
              Dashboard Analytics
            </h2>

            {error && (
              <div className="text-center py-4 text-red-500">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-10">
                <p>Loading order data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue'];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="orders" fill="#4F46E5" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue'];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        strokeWidth={3} 
                        name="Revenue" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;