import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../Components/Prices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../Context/Cart";
import { motion } from "framer-motion";
import { ChevronDown, ArrowDown } from "lucide-react";

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

  const productsRef = useRef(null); // Ref for products section

  // ✅ Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-category`
      );
      if (data?.success) setCategories(data?.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/product-list/${page}`
      );
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
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/product-list/${page}`
      );
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
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/product-filters`,
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial fetch
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <section className="relative w-full h-[600px] md:h-[500px] lg:h-[600px] overflow-hidden">
  <video
    autoPlay
    loop
    muted
    playsInline
    poster="/hero-poster.jpg"
    className="absolute top-0 left-0 w-full h-full object-cover md:object-center"
    src="/hero-video.mp4"
  />
  
  <div className="absolute inset-0 bg-black/35"></div>

  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-fadeInUp">
       Discover Your Perfect Products
    </h1>
    <p className="text-lg md:text-xl text-white/90 max-w-2xl animate-fadeInUp delay-150">
       Browse, select, and experience the best quality products with ease
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => productsRef.current.scrollIntoView({ behavior: "smooth" })}
      className="shop-button mt-6 px-6 py-3 bg-gradient-to-r from-pink-900 via-purple-900 to-yellow-700 text-white text-lg font-bold shadow-lg hover:shadow-2xl transition-all"
    >
      Shop Now
    </motion.button>
  </div>
</section>


      <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 px-4 md:px-10 -mt-28 
    bg-gradient-to-r from-pink-300 via-fuchsia-100 to-blue-500 
    bg-[length:400%_400%] animate-gradient">
        <motion.aside
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="hidden mt-3 md:block md:col-span-1 bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6 sticky top-5 h-fit"
        >
          <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">
            Filters
          </h2>
          <div className=" flex flex-col gap-2 mb-4">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h2 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">
            Price Range
          </h2>
          <Radio.Group
            onChange={(e) => setRadio(e.target.value)}
            className="flex flex-col gap-2"
          >
            {Prices?.map((p) => (
              <Radio key={p._id} value={p.array}>
                {p.name}
              </Radio>
            ))}
          </Radio.Group>
        </motion.aside>

        <main ref={productsRef} className="md:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
            {products?.map((p, index) => (
              <motion.div
                key={p._id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="relative h-56 w-full overflow-hidden rounded-t-xl bg-gray-100">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${p._id}`}
                    alt={p.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=Product+Image";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-md font-bold text-gray-800 truncate mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {p.description.substring(0, 50)}...
                  </p>
                  <p className="text-md font-semibold text-green-600 mb-3">
                    ₹ {p.price}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/${p.slug}`)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setCart((prevCart) => [...prevCart, p]);
                        toast.success("Added to cart!");
                      }}
                      className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-10 relative z-10">
            {products && products.length < total && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
                className="load-more flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-2xl border-2 border-white/30 relative overflow-hidden"
              >
                <span>{loading ? "Loading..." : "Load More"}</span>
                {!loading && <ChevronDown className="animate-bounce w-5 h-5" />}
                <span className="absolute -top-2 -left-2 w-4 h-4 bg-white/30 rounded-full animate-ping"></span>
                <span className="absolute -bottom-2 -right-2 w-4 h-4 bg-white/30 rounded-full animate-ping delay-150"></span>
              </motion.button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
