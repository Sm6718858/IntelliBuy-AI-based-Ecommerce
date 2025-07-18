import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../Hook/useCategory";

const Category = () => {
  const Category = useCategory();

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100 py-12 px-4">
      <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-10 drop-shadow-lg">
        🌈 Explore IntelliBuy Categories
      </h1>

      <div style={{ textDecoration: 'none' }} className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Category.map((c) => (
          <Link
            key={c._id}
            style={{ textDecoration: 'none' }} 
            to={`/category/${c.slug}`}
            className="relative group p-6 rounded-2xl bg-gradient-to-br from-indigo-400 via-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 border-2 border-white"
          >
            <div style={{ textDecoration: 'none' }}  className="text-lg text-center tracking-wide underline decoration-white decoration-dotted group-hover:decoration-wavy">
              {c.name}
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 group-hover:animate-pulse rounded-2xl pointer-events-none"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
