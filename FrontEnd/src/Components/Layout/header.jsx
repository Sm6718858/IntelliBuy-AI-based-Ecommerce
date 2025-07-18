import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../Hook/useCategory';
import { useCart } from '../../Context/Cart';
import { Badge } from 'antd';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/Logo.jpg';

const Header = () => {
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const Category = useCategory();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logout successful!');
    navigate('/login');
    setUserDropdownOpen(false);
  };

  const linkStyle = ({ isActive }) =>
    `px-4 py-2 font-semibold text-sm tracking-wide transition-all duration-300 no-underline
     ${isActive ? 'bg-white text-indigo-700 shadow-md rounded-full' : 'text-white hover:bg-amber-400 hover:text-black rounded-full'}`;

  return (
    <header className="bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-lg sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center justify-between w-full md:w-auto">
      <NavLink to="/" style={{ textDecoration: 'none' }}  className="flex items-center gap-2">
        <img src={logo} alt="IntelliBuy Logo" className="h-10 sm:h-12 md:h-14 w-auto object-contain" />
        <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-wide hidden sm:inline">IntelliBuy</span>
      </NavLink>

      <button className="text-white md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    <div className="w-full md:w-auto">
      <SearchInput />
    </div>

    <div className={`w-full md:w-auto flex-col md:flex md:flex-row gap-4 md:gap-6 items-center text-sm md:text-base ${mobileMenuOpen ? 'flex' : 'hidden'} md:flex`}>
      <NavLink to="/home" style={{ textDecoration: 'none' }}  className={linkStyle}>Home</NavLink>

      <div className="relative">
        <button
          onClick={() => {
            setCategoryDropdownOpen(!categoryDropdownOpen);
            setUserDropdownOpen(false);
          }}
          className="text-white px-4 py-2 font-semibold text-sm hover:bg-amber-400 hover:text-black rounded transition-all"
        >
          Categories ▼
        </button>
        {categoryDropdownOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
            <Link to="/categories" style={{ textDecoration: 'none' }}  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 no-underline" onClick={() => setCategoryDropdownOpen(false)}>
              All Categories
            </Link>
            {Category?.map((c) => (
              <Link key={c._id} style={{ textDecoration: 'none' }}  to={`/category/${c.slug}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 no-underline" onClick={() => setCategoryDropdownOpen(false)}>
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {!auth.user ? (
        <>
          <NavLink style={{ textDecoration: 'none' }}  to="/login" className={linkStyle}>Login</NavLink>
          <NavLink style={{ textDecoration: 'none' }}  to="/register" className={linkStyle}>Register</NavLink>
        </>
      ) : (
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setCategoryDropdownOpen(false);
            }}
            className="text-white px-4 py-2 font-semibold text-sm hover:bg-amber-400 hover:text-black rounded-full transition-all"
          >
            {auth.user.name?.toUpperCase() || 'User'} ▼
          </button>
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
              <NavLink
                to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                className="block px-4 py-2 hover:bg-gray-100 no-underline"
                onClick={() => setUserDropdownOpen(false)}
              >
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <Badge count={cart?.length} offset={[0, 5]} showZero>
        <NavLink style={{ textDecoration: 'none' }}  to="/cart" className={linkStyle}>Cart</NavLink>
      </Badge>
    </div>
  </div>
</header>

  );
};

export default Header;
