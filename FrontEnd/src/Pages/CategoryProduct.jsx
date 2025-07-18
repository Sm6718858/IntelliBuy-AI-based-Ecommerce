import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Context/Cart";
import { toast } from "react-hot-toast";
import axios from "axios";

const CategoryProduct = () => {
  const params = useParams();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-6">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
          🛒 Category - {category?.name}
        </h2>
        <p className="text-center text-lg text-gray-600 mb-8">
          {products?.length} result{products?.length === 1 ? "" : "s"} found
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {products?.length > 0 ? (
            products.map((p) => (
              <div
                key={p._id}
                className="w-[18rem] bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 overflow-hidden border border-gray-200"
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/api/product-Photo/${p._id}`}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col justify-between min-h-[200px]">
                  <h5 className="text-lg font-semibold text-gray-800">{p.name}</h5>
                  <p className="text-gray-500 text-sm mb-1">
                    {p.description?.substring(0, 50)}...
                  </p>
                  <p className="text-indigo-600 font-bold text-md mb-3">₹{p.price}</p>
                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                      onClick={() => {
                        setCart((prevCart) => [...prevCart, p]);
                        toast.success("Added to cart successfully!");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-lg mt-10">
              No products found in this category.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CategoryProduct;
