import React, { useState, useEffect } from 'react';
import UserMenu from '../UserMenu';
import axios from 'axios';
import { useAuth } from '../../Context/Auth';
import moment from 'moment';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      setOrders(data.orders);
    } catch (error) {
      console.error("Error getting orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Canceled':
        return 'bg-red-100 text-red-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 p-4 md:p-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <UserMenu />
          </div>
        </div>
        <div className="md:w-3/4 w-full">
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-center uppercase">
              Your Orders
            </h2>

            {loading ? (
              <div className="text-center text-gray-500">Loading orders...</div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm md:text-base">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Payment</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{order.orderId}</td>
                        <td className="px-4 py-3">
                          {moment(order.createdAt).format('DD/MM/YYYY hh:mm A')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.payStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.payStatus === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.payStatus?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                          {order.statusUpdatedAt && (
                            <div className="text-gray-500 text-xs mt-1">
                              Updated: {moment(order.statusUpdatedAt).format('DD/MM/YYYY')}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-indigo-700">₹{order.amount}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2">
                            {order.cartItems.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 border border-gray-200 rounded-md p-2"
                              >
                                <img
                                  src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${item._id}`}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-md border"
                                />
                                <div className="max-w-[140px] truncate text-ellipsis whitespace-nowrap">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-gray-500 text-sm">₹{item.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-4">
                You haven't placed any orders yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
