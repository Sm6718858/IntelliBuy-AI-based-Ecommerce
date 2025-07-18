import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [Category, setCategory] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get-category`);
      setCategory(data?.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return Category;
}