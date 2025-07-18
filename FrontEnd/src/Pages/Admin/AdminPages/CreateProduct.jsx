import React, { useState, useEffect } from "react";
import AdminMenu from "../AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-category`
      );
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-product`,
        productData
      );

      if (data?.success) {
        toast.success("✅ Product Created Successfully");
        navigate("/dashboard/admin/Products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-10 flex-grow">
        <div className="md:w-1/4">
          <AdminMenu />
        </div>

        <div className="md:w-3/4 w-full">
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-center uppercase">
              Create Product
            </h2>

            {/* Category Select */}
            <Select
              placeholder="Select a category"
              size="large"
              showSearch
              className="w-full mb-4 border rounded-md px-2 py-1"
              onChange={(value) => setCategory(value)}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>

            {/* Photo Upload */}
            <div className="mb-4">
              <label className="cursor-pointer block text-center py-3 px-4 border-2 border-dashed border-indigo-400 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium transition duration-200">
                {photo ? photo.name : "📁 Upload Product Photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>

            {photo && (
              <div className="mb-4 text-center">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="product"
                  className="h-48 mx-auto object-contain rounded-md border border-indigo-200"
                />
              </div>
            )}

            {/* Input Fields */}
            <input
              type="text"
              value={name}
              placeholder="Product Name"
              className="w-full mb-4 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              value={description}
              placeholder="Product Description"
              className="w-full mb-4 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              value={price}
              placeholder="Price"
              className="w-full mb-4 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="number"
              value={quantity}
              placeholder="Quantity"
              className="w-full mb-4 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setQuantity(e.target.value)}
            />

            <Select
              placeholder="Select Shipping"
              size="large"
              className="w-full mb-6 border rounded-md px-2 py-1"
              onChange={(value) => setShipping(value)}
            >
              <Option value="0">No</Option>
              <Option value="1">Yes</Option>
            </Select>

            {/* Submit Button */}
            <button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              🚀 CREATE PRODUCT
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CreateProduct;
