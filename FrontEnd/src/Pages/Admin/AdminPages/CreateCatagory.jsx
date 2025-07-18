import React, { useEffect, useState } from 'react';
import AdminMenu from '../AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../../Components/Form/CategoryForm';
import { Modal } from 'antd';
import { useAuth } from '../../../Context/Auth';

const CreateCatagory = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-category`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data.success) {
        toast.success(`${name} category added successfully`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Create category error:", error);
      toast.error("Something went wrong while creating category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/update-category/${selected._id}`,
        { name: updatedName },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data.success) {
        toast.success("Category updated successfully");
        setVisible(false);
        setSelected(null);
        setUpdatedName("");
        getAllCategory();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update category error:", error);
      toast.error("Something went wrong while updating category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/delete-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error("Something went wrong while deleting category");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-category`
      );
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Get categories error:", error);
      toast.error("Something went wrong in fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-10 flex-grow">
        <div className="md:w-1/4">
          <AdminMenu />
        </div>
        <div className="md:w-3/4 w-full">
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-center uppercase">
              Manage Categories
            </h2>

            {/* Add Category Form */}
            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />

            {/* Category List */}
            <div className="mt-6 overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories?.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{cat.name}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-md hover:from-indigo-600 hover:to-blue-700 transition text-sm"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(cat.name);
                            setSelected(cat);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                          onClick={() => handleDelete(cat._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Modal */}
            <Modal
              title="Edit Category"
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CreateCatagory;
