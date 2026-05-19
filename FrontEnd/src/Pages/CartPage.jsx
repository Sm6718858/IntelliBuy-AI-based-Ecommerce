import React, { useState } from "react";
import { useCart } from "../Context/Cart";
import { useAuth } from "../Context/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingBag, MapPin, CreditCard, LogIn, ArrowLeft } from "lucide-react";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  };

  const totalPrice = () => {
    try {
      const total = calculateSubtotal();
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      });
    } catch {
      return "₹0";
    }
  };

  const updateQuantity = (pid, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map((item) =>
      item._id === pid ? { ...item, quantity: newQty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeCartItem = (pid) => {
    const updated = cart.filter((item) => item._id !== pid);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Removed from cart");
  };

  const handlePayment = async () => {
    if (!auth?.token) return navigate("/login", { state: "/cart" });
    if (!auth?.user?.address)
      return navigate("/dashboard/user/profile", { state: { from: "/cart" } });

    try {
      setLoading(true);
      const total = calculateSubtotal();

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/checkout`,
        {
          amount: total,
          cartItems: cart,
          userShipping: auth.user.address,
          userId: auth.user._id,
        }
      );

      const rzp = new window.Razorpay({
        key: "rzp_test_8UQCBcF3ea7T2Z",
        amount: data.amount * 100,
        currency: "INR",
        name: "Shivam E-Shop",
        order_id: data.orderId,
        handler: async (res) => {
          try {
            const verify = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/verify`,
              {
                ...res,
                cartItems: cart,
                userShipping: auth.user.address,
                userId: auth.user._id,
                paymentRecordId: data.paymentRecordId,
              }
            );

            if (verify.data.success) {
              toast.success("Payment successful ✨");
              localStorage.removeItem("cart");
              setCart([]);
              navigate("/dashboard/user/orders");
            } else {
              toast.error("Payment verification failed");
            }
          } catch {
            toast.error("Error during verification process");
          }
        },
        theme: { color: "#4f46e5" },
      });

      rzp.open();
    } catch {
      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 p-4 md:p-10 selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Hey {auth?.user?.name || "Guest"} 👋
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2 font-medium text-base">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            {cart.length
              ? `You have ${cart.length} unique item${cart.length > 1 ? "s" : ""} selected`
              : "Your cart looks empty!"}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center bg-white border border-slate-100 max-w-md mx-auto p-10 rounded-3xl shadow-xl shadow-slate-100/70 mt-12 transform transition-all">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h3>
            <p className="text-slate-500 mb-8 text-sm max-w-xs mx-auto">
              Explore our selection and add products to get started on your order.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item._id + index}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 p-4 flex flex-col sm:flex-row gap-5"
                >
                  <div className="overflow-hidden rounded-xl w-full sm:w-32 h-32 bg-slate-50 flex-shrink-0 relative border border-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-slate-900 font-extrabold text-lg whitespace-nowrap">
                          ₹{item.price * (item.quantity || 1)}
                        </p>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
                        <button
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                          className="p-1.5 hover:bg-white rounded-lg transition text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent"
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-800 select-none">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                          className="p-1.5 hover:bg-white rounded-lg transition text-slate-500 hover:text-indigo-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeCartItem(item._id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-10 h-fit">
              <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-slate-900 pb-4 border-b border-slate-100 text-center">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600 text-sm font-medium">
                    <span style={{ marginLeft: '20px' }}>Subtotal Items</span>
                    <span style={{ marginRight: '20px' }} className="text-slate-900 font-semibold">{cart.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-sm font-medium">
                    <span style={{ marginLeft: '20px' }}>Shipping Fee</span>
                    <span style={{ marginRight: '12px' }} className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <hr className="border-slate-100" />
                  <div className="flex justify-between items-baseline pt-2">
                    <span style={{ marginLeft: '20px' }} className="text-base font-bold text-slate-900">Total Amount</span>
                    <span style={{ marginRight: '20px' }} className="text-2xl font-black text-indigo-600 tracking-tight">
                      {totalPrice()}
                    </span>
                  </div>
                </div>

                {auth?.user?.address ? (
                  <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-0.5">
                          Deliver To
                        </p>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed line-clamp-2">
                          {auth.user.address}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/dashboard/user/profile", { state: { from: "/cart" } })}
                      className="absolute right-4 top-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      navigate(
                        auth?.token ? "/dashboard/user/profile" : "/login",
                        { state: { from: "/cart" } }
                      )
                    }
                    className="w-full mb-6 py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 text-amber-900 font-bold text-sm flex items-center justify-center gap-2 transition duration-200"
                  >
                    {auth?.token ? (
                      <>
                        <MapPin className="w-4 h-4 text-amber-700" /> Add Delivery Address
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 text-amber-700" /> Login to Checkout
                      </>
                    )}
                  </button>
                )}

                <button
                  style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}
                  disabled={loading || !cart.length || !auth?.user?.address}
                  onClick={handlePayment}
                  className={`w-full py-4 rounded-2xl font-bold text-white tracking-wide shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] ${loading || !cart.length || !auth?.user?.address
                      ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10 hover:shadow-xl hover:shadow-indigo-600/20"
                    }`}
                >
                  <CreditCard className="w-5 h-5" />
                  {loading ? "Processing Order..." : "Proceed to Payment"}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;