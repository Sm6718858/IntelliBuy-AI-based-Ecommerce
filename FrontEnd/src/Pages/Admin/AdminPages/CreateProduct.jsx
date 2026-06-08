import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../AdminMenu";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);
  const [sizes, setSizes] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-category`
      );

      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (sizes.length === 0) {
      return toast.error("Please select at least one size");
    }

    if (!photo) {
      return toast.error("Please select a product image");
    }

    try {
      const formData = new FormData();
      formData.append("image", photo);

      const uploadRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload-product-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = uploadRes.data.imageUrl;

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-product`,
        {
          name,
          description,
          price,
          quantity,
          category,
          shipping,
          image: imageUrl,
          sizes,
        }
      );

      if (data?.success) {
        toast.success("Product Created Successfully");

        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setShipping(false);
        setSizes([]);
        setPhoto(null);

        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <aside className="md:w-1/4 bg-white rounded-xl shadow-lg p-4 h-fit">
          <AdminMenu />
        </aside>

        <main className="md:w-3/4 bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="md:text-xl font-bold mb-8 text-center text-indigo-700 uppercase">
            Create New Product
          </h1>

          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <div>
              <label className="font-semibold block mb-2">
                Category
              </label>

              <Select
                className="w-full"
                size="large"
                placeholder="Select Category"
                value={category || undefined}
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Shipping
              </label>

              <Select
                className="w-full"
                size="large"
                value={shipping}
                onChange={(value) => setShipping(value)}
              >
                <Option value={false}>No</Option>
                <Option value={true}>Yes</Option>
              </Select>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Sizes
              </label>

              <Select
                mode="multiple"
                placeholder="Select Sizes"
                className="w-full"
                size="large"
                value={sizes}
                onChange={(value) => setSizes(value)}
              >
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
                <Option value="XL">XL</Option>
                <Option value="XXL">XXL</Option>
              </Select>

              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Product Name
              </label>

              <input
                type="text"
                value={name}
                placeholder="Enter product name"
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Price (₹)
              </label>

              <input
                type="number"
                value={price}
                placeholder="Enter price"
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Quantity
              </label>

              <input
                type="number"
                value={quantity}
                placeholder="Enter quantity"
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />

              {photo && (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  className="h-24 mt-3 rounded-lg border object-cover"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold block mb-2">
                Description
              </label>

              <textarea
                rows="4"
                value={description}
                placeholder="Write product description..."
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition"
                style={{ borderRadius: "20px" }}
              >
                Create Product
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;