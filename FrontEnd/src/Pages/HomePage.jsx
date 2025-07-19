import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../Components/Prices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../Context/Cart";
import { MenuOutlined } from "@ant-design/icons";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get-category`);
      if (data?.success) setCategories(data?.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    value ? all.push(id) : (all = all.filter((c) => c !== id));
    setChecked(all);
  };

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/product-filters`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 py-10 px-4 md:px-10">
      <header className="flex justify-between items-center px-4 md:px-10 py-2 bg-white shadow-md rounded-xl mb-6">
        <br />
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <MenuOutlined className="text-2xl" />
        </button>
      </header>

      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white mb-12 shadow-2xl">
        <div className="absolute top-4 left-0 w-full overflow-hidden z-20">
          <div className="animate-marquee whitespace-nowrap text-pink-100 text-sm md:text-lg font-semibold tracking-widest">
            {Array(10).fill("👋 Welcome Dear").map((item, i) => (
              <span key={i} className="mx-6 inline-block">{item}</span>
            ))}
          </div>
        </div>
        <br /> <br />
        <div className="relative z-10 px-6 md:px-20 py-24 text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-pink-500 mb-6 drop-shadow-lg">
            Welcome to <span className="text-white">IntelliBuy</span>
          </h1>
          <p className="text-base md:text-xl max-w-2xl text-gray-300 font-medium mb-10 px-4">
            Discover things to shop – curated products, best filters, unbeatable deals and AI help.
          </p>
          <button
            style={{ border: "3px solid pink", width: "100px", borderRadius: "10px", marginBottom: '5px' }}
            onClick={() => toast("❤️ Thank you for visiting IntelliBuy! ❤️")}
            className="text-yellow-400 font-bold py-2 px-8 rounded-full hover:bg-pink-500 hover:text-black transition-all duration-300 shadow-md"
          >
            ❤️ Wish Click
          </button>
        </div>
        <div className="absolute inset-0 bg-black opacity-20 z-0" />
      </section>
      <br /><br />

     <div className={`fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
  <div
    className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? "opacity-40" : "opacity-0"}`}
    onClick={() => setIsMenuOpen(false)}
  />
  <div className={`absolute top-0 right-0 bg-white w-full max-w-sm min-h-full shadow-xl rounded-l-3xl p-6 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
    <div className="flex justify-between items-center border-b pb-2 mb-4">
      <h2 className="text-xl font-bold text-indigo-700 mx-4 mt-3">Filter Products</h2>
      <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">
        ✕
      </button>
    </div>

    {/* Category Filters */}
    <div className="mb-8">
      <h3 className="text-base font-semibold text-indigo-700 mb-3 mx-2">Categories</h3>
      <div className="grid grid-cols-2 gap-3">
        {categories?.map((c) => (
          <label key={c._id} className="flex items-center space-x-2">
            <Checkbox
              onChange={(e) => handleFilter(e.target.checked, c._id)}
              className="accent-indigo-600"
            />
            <span className="text-gray-700 text-sm">{c.name}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Filters */}
    <div className="mb-8">
      <h3 className="text-base font-semibold text-indigo-700 mb-3 mx-2">Price Range</h3>
      <Radio.Group
        onChange={(e) => setRadio(e.target.value)}
        className="flex flex-col space-y-3"
      >
        {Prices?.map((p) => (
          <Radio key={p._id} value={p.array} className="text-sm text-gray-700">
            {p.name}
          </Radio>
        ))}
      </Radio.Group>
    </div>

    {/* Filter Buttons */}
    <br />
    <div className="mt-10 flex flex-col gap-4">
      <button
      style={{borderRadius:'10px'}}
        onClick={() => {
          setChecked([]);
          setRadio([]);
          setIsMenuOpen(false);
          toast.success("Filters reset!");
        }}
        className="w-full py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:scale-[1.02] transition-transform"
      >
        RESET FILTERS
      </button>
      <button
        style={{borderRadius:'10px'}}
        onClick={() => setIsMenuOpen(false)}
        className="w-full py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition"
      >
        APPLY FILTERS
      </button>
    </div>
  </div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <aside className="hidden md:block md:col-span-1 bg-[#F3E2E5] rounded-xl shadow-xl p-6 sticky top-5 h-fit">
          <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">Filters</h2>
          <div className="flex flex-col gap-2 mb-4">
            {categories?.map((c) => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h2 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Price Range</h2>
          <Radio.Group onChange={(e) => setRadio(e.target.value)} className="flex flex-col gap-2">
            {Prices?.map((p) => (
              <Radio key={p._id} value={p.array}>{p.name}</Radio>
            ))}
          </Radio.Group>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-xl hover:scale-105 transition-all"
          >
            RESET FILTERS
          </button>
        </aside>

        <main className="md:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((p) => (
              <div key={p._id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden">
                {/* Improved Image Container */}
                <div className="relative h-64 w-full overflow-hidden rounded-t-2xl bg-gray-100">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${p._id}`}
                    alt={p.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x300?text=Product+Image";
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 truncate mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{p.description.substring(0, 50)}...</p>
                  <p className="text-lg font-semibold text-green-600 mb-4">₹ {p.price}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/${p.slug}`)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setCart((prevCart) => [...prevCart, p]);
                        toast.success("Added to cart!");
                      }}
                      className="flex-1 py-2 bg-gray-800 text-white rounded-xl hover:bg-black"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            {products && products.length < total && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
                className="px-8 py-2 bg-gradient-to-r from-pink-400 to-yellow-500 text-white text-lg font-semibold rounded-full hover:scale-105 transition-all"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;