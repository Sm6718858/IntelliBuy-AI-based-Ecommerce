import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Layout from './Components/Layout/Layout';
import Register from './Pages/Authentication/Register';
import Login from './Pages/Authentication/Login';
import Dashboard from './user/Dashboard';
import PrivateRoute from './Components/Routes/Private';
import Forgot_Password from './Pages/Authentication/Forgot-Password';
import AdminRoute from './Components/Routes/AdminRoute';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import CreateCatagory from './Pages/Admin/AdminPages/CreateCatagory';
import CreateProduct from './Pages/Admin/AdminPages/CreateProduct';
import Users from './Pages/Admin/AdminPages/Users';
import Profile from './user/UserPages/Profile';
import Orders from './user/UserPages/Orders';
import { Toaster } from 'react-hot-toast';
import Products from './Pages/Admin/AdminPages/Products';
import UpdateProduct from './Pages/Admin/AdminPages/UpdateProduct';
import { FaCommentDots } from "react-icons/fa";
import ChatBot from "./Components/ChatBot";
import Search from './Pages/Search';
import ProductDetails from './Pages/ProductDetails';
import Categories from './Pages/Categories';
import CategoryProduct from './Pages/CategoryProduct';
import CartPage from './Pages/CartPage';
import AdminOrders from './Pages/Admin/AdminPages/AdminOrders';
import ScrollToTop from './Components/ScrollToTop';

const App = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/product/:slug' element={<ProductDetails />} />
          <Route path='/category/:slug' element={<CategoryProduct />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/search' element={<Search />} />
          <Route path='/dashboard' element={<PrivateRoute />}>
            <Route path='user' element={<Dashboard />} />
            <Route path='user/profile' element={<Profile />} />
            <Route path='user/orders' element={<Orders />} />
          </Route>
          <Route path='/dashboard' element={<AdminRoute />}>
            <Route path='admin' element={<AdminDashboard />} />
            <Route path='admin/create-catagory' element={<CreateCatagory />} />
            <Route path='admin/create-product' element={<CreateProduct />} />
            <Route path='admin/Products' element={<Products />} />
            <Route path='admin/Product/:slug' element={<UpdateProduct />} />
            <Route path='admin/users' element={<Users />} />
            <Route path='admin/AdminOrders' element={<AdminOrders />} />
          </Route>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Forgot_Password' element={<Forgot_Password />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/' element={<HomePage />} />
        </Route>
      </Routes>

      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
      <button
        onClick={() => setShowChat(!showChat)}
        style={{borderRadius: '50%'}}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 shadow-lg z-40"
      >
        <FaCommentDots size={24} />
      </button>
    </>
  );
};

export default App;
