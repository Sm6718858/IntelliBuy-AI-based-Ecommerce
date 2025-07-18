import React, { useState, useEffect } from 'react';
import AdminMenu from '../AdminMenu';
import { useAuth } from '../../../Context/Auth';
import axios from 'axios';
import moment from 'moment';
import { Select } from 'antd';
import toast from 'react-hot-toast';

const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled"
  ];

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/all-orders`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`
        }
      });
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error getting orders:", error);
      toast.error("❌ Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/order-status/${orderId}`,
        { status: value },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`
          }
        }
      );
      if (data?.success) {
        toast.success("✅ Order status updated");
        // Update only that order in the list instead of refreshing all
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, orderStatus: value } : order
          )
        );
      } else {
        toast.error("⚠️ Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("❌ Failed to update order status");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 p-4 md:p-10 flex flex-col">
      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        <div className="md:w-1/4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <AdminMenu />
          </div>
        </div>

        <div className="md:w-3/4 w-full">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center uppercase">
              All Orders
            </h2>

            {loading ? (
              <div className="text-center text-gray-600">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-500">No orders found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-300 text-sm md:text-base">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="py-3 px-4 text-left">Order ID</th>
                      <th className="py-3 px-4 text-left">Customer</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Payment</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Amount</th>
                      <th className="py-3 px-4 text-left">Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{order.orderId}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold">{order.userId?.name}</p>
                          <p className="text-gray-500 text-sm">{order.userId?.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          {moment(order.createdAt).format("DD MMM YYYY hh:mm A")}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.payStatus === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {order.payStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            bordered={false}
                            value={order.orderStatus}
                            onChange={(value) => handleStatusChange(order._id, value)}
                            className="w-[140px]"
                            getPopupContainer={(trigger) => trigger.parentNode}
                          >
                            {statusOptions.map((status, idx) => (
                              <Option key={idx} value={status}>{status}</Option>
                            ))}
                          </Select>
                        </td>
                        <td className="py-3 px-4 font-semibold text-blue-700">
                          ₹{order.amount}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-2">
                            {order.cartItems.map((item, idx) => (
                              <div
                                key={idx}
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
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminOrders;
