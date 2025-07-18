import React, { useState } from "react";
import { useCart } from "../Context/Cart";
import { useAuth } from "../Context/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      const total = cart.reduce((acc, item) => acc + item.price, 0);
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      return "₹0";
    }
  };

  const removeCartItem = (pid) => {
    const updated = cart.filter((item) => item._id !== pid);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Item removed from cart");
  };

  const handlePayment = async () => {
    if (!auth?.token) return navigate("/login", { state: "/cart" });
    if (!auth?.user?.address) return navigate("/dashboard/user/profile", { state: { from: "/cart" } });

    try {
      setLoading(true);
      const total = cart.reduce((acc, item) => acc + item.price, 0);
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/checkout`, {
        amount: total,
        cartItems: cart,
        userShipping: auth?.user?.address,
        userId: auth?.user?._id,
      });

      const rzp = new window.Razorpay({
        key: "rzp_test_8UQCBcF3ea7T2Z",
        amount: data.amount * 100,
        currency: "INR",
        name: "Shivam E-Shop",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async (res) => {
          const verify = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/verify`, {
            ...res,
            cartItems: cart,
            userShipping: auth.user.address,
            userId: auth.user._id,
            paymentRecordId: data.paymentRecordId,
          });
          if (verify.data.success) {
            toast.success("Payment successful!");
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
          } else toast.error("Verification failed");
        },
        prefill: {
          name: auth?.user?.name || "",
          email: auth?.user?.email || "",
          contact: "9999999999",
        },
        theme: { color: "#6366f1" },
      });

      rzp.open();
    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">
          Hello {auth?.user?.name || "Guest"}
        </h1>
        <h2 className="text-center text-lg mb-10 text-gray-700">
          {cart.length > 0
            ? `You have ${cart.length} item(s) in your cart`
            : "Your Cart is Empty"}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {cart.map((item, index) => (
              <div
                key={item._id + index}
                className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition-all flex flex-col md:flex-row gap-6"
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/api/product-Photo/${item._id}`}
                  alt={item.name}
                  className="w-full md:w-40 h-40 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 mb-2">{item.description?.slice(0, 100)}...</p>
                  <p className="text-green-600 font-bold mb-3">₹ {item.price}</p>
                  <button
                    onClick={() => removeCartItem(item._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8 border border-indigo-100 sticky top-10 h-fit transition-all duration-300 hover:shadow-indigo-300">
            <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-700 tracking-wide">
              🛒 Cart Summary
            </h2>

            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <span style={{marginLeft:'10px'}} className="text-lg font-medium text-gray-600">Total Items:</span>
              <span style={{marginRight:'20px'}} className="text-lg font-semibold text-gray-800">{cart.length}</span>
            </div>

            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <span style={{marginLeft:'10px'}} className="text-lg font-medium text-gray-600">Total Price:</span>
            <span style={{marginRight:'15px'}} className="text-lg font-semibold text-green-600">{totalPrice()}</span>
            </div>

            {auth?.user?.address ? (
              <div className="mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-700 mb-1">Shipping Address</h4>
                  <p className="text-sm text-blue-700">{auth.user.address}</p>
                  <button
                    onClick={() => navigate("/dashboard/user/profile", { state: { from: "/cart" } })}
                    className="mt-2 text-indigo-600 hover:underline text-sm"
                  >
                    ✏️ Update Address
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 text-lg font-semibold rounded-xl mb-6 transition duration-200"
                onClick={() =>
                  navigate(auth?.token ? "/dashboard/user/profile" : "/login", {
                    state: { from: "/cart" },
                  })
                }
              >
                {auth?.token ? "Add Address" : "Login to Checkout"}
              </button>
            )}

            <button
              disabled={loading || cart.length === 0 || !auth?.user?.address}
              onClick={handlePayment}
              style={{borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'}}
              className={`w-full py-3 rounded-xl text-white text-lg font-bold transition-all duration-200 ${
                loading || cart.length === 0 || !auth?.user?.address
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Processing..." : "💳 Make Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
