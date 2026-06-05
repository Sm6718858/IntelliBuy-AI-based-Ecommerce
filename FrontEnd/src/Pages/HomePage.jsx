import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Checkbox, Radio, Divider, Drawer } from "antd";
import { Prices } from "../Components/Prices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../Context/Cart";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ShoppingCart, Eye } from "lucide-react";

const heroSlides = [
  {
    title: "Shop Smarter",
    subtitle: "Curated premium products just for you",
    image: "https://tse3.mm.bing.net/th/id/OIP.n5hQrtKfytHNt8bPTuQr3gHaE6?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    title: "Discover New Trends",
    subtitle: "Latest collections at best prices",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  },
  {
    title: "Fast • Secure • Reliable",
    subtitle: "A modern shopping experience",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
  },
];

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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const productsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setActiveSlide((p) => (p + 1) % heroSlides.length), 3500);
    return () => clearInterval(interval);
  }, []);

  const getAllCategory = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get-category`);
    if (data?.success) setCategories(data.categories);
  };

  const getAllProducts = async () => {
    setLoading(true);
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/product-list/${page}`);
    setLoading(false);
    setProducts(data.products);
  };

  const loadMore = async () => {
    setLoading(true);
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/product-list/${page}`);
    setLoading(false);
    setProducts([...products, ...data.products]);
  };

  const filterProduct = async () => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/product-filters`, { checked, radio });
    setProducts(data.products);
  };

  useEffect(() => {
    getAllCategory();
  },[]);

  useEffect(() => {
    if (page > 1) loadMore();
  }, [page]);

  useEffect(() => {
    if (!checked.length && !radio.length) { getAllProducts(); setPage(1); }
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  },[checked, radio]);

  const FilterContent = ({ close }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold">Filters</h2>
        {close && <X onClick={close} className="cursor-pointer" />}
      </div>
      <Divider>Categories</Divider>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto px-2">
        {categories.map((c) => (
          <Checkbox key={c._id} checked={checked.includes(c._id)} onChange={(e) => {
            let all = e.target.checked ? [...checked, c._id] : checked.filter((id) => id !== c._id);
            setChecked(all);
          }}>{c.name}</Checkbox>
        ))}
      </div>
      <Divider>Price</Divider>
      <Radio.Group className="flex flex-col gap-2 px-2" onChange={(e) => setRadio(e.target.value)} value={radio}>
        {Prices.map((p) => <Radio key={p._id} value={p.array}>{p.name}</Radio>)}
      </Radio.Group>
      <button style={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} onClick={() => { setChecked([]); setRadio([]); setMobileFilterOpen(false); getAllProducts(); }} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold">Reset Filters</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative h-[90vh] overflow-hidden">
        <AnimatePresence>
          <motion.div key={activeSlide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
            <img src={heroSlides[activeSlide].image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4">{heroSlides[activeSlide].title}</h1>
              <p className="text-xl mb-8">{heroSlides[activeSlide].subtitle}</p>
              <button onClick={() => productsRef.current.scrollIntoView({ behavior: "smooth" })} style={{ borderRadius: '20px' }} className="px-10 w-[120px] py-4 bg-white text-black rounded-full font-bold">Shop Now</button>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <section ref={productsRef} className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
            <FilterContent />
          </div>
        </aside>

        <main className="md:col-span-4">
          <div className="md:hidden mb-6">
            <button onClick={() => setMobileFilterOpen(true)} className="flex items-center gap-2 px-5 py-3 border rounded-full bg-white shadow-sm"><Filter size={18} /> Filters</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-3">
            {products.map((p) => (
              <motion.div key={p._id} whileHover={{ y: -8 }} className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col transition-all duration-300">
                <div className="h-56 bg-slate-100 flex items-center justify-center p-6">
                  <img src={p.image} className="h-full object-contain mix-blend-multiply" />
                </div>
                <div className="p-6 flex-grow m-3">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">{p.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{p.description}</p>
                  <p className="text-2xl font-extrabold text-blue-800 mb-6">₹{p.price.toLocaleString()}</p>
                  <div className="flex gap-3 mt-auto">
                    <button onClick={() => navigate(`/product/${p.slug}`)} className="flex-1 border border-slate-200 rounded-xl py-3 font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2"><Eye size={18} /> View</button>
                    <button onClick={() => { setCart([...cart, p]); toast.success("Added to cart!"); }} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"><ShoppingCart size={18} /> Add</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {products.length < total && (
            <div className="flex justify-center mt-16">
              <button onClick={() => setPage(page + 1)} style={{ borderRadius: '10px' }} className="px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition">
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </main>
      </section>

      <Drawer closeIcon={null} open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} placement="left" width={300}>
        <FilterContent close={() => setMobileFilterOpen(false)} />
      </Drawer>
    </div>
  );
};

export default HomePage;