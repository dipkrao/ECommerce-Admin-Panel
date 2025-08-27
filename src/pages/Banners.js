import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Calendar,
  Link as LinkIcon,
  GripVertical,
} from "lucide-react";
import { bannerAPI } from "../utils/api";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    buttonText: "Shop Now",
    isActive: true,
    order: 0,
    startDate: "",
    endDate: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerAPI.getAll();
      setBanners(response.data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link: "",
      buttonText: "Shop Now",
      isActive: true,
      order: 0,
      startDate: "",
      endDate: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingBanner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that image is selected for new banners
    if (!editingBanner && !imageFile) {
      alert("Please select an image for the banner.");
      return;
    }

    try {
      console.log("Creating banner with data:", formData);
      console.log("Image file:", imageFile);
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
          console.log(`Appending ${key}:`, formData[key]);
        }
      });

      if (imageFile) {
        formDataToSend.append("image", imageFile);
        console.log("Appending image file:", imageFile.name, imageFile.type, imageFile.size);
      }

      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      if (editingBanner) {
        console.log("Updating banner:", editingBanner._id);
        await bannerAPI.update(editingBanner._id, formDataToSend);
      } else {
        console.log("Creating new banner");
        await bannerAPI.create(formDataToSend);
      }

      console.log("Banner saved successfully!");
      fetchBanners();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving banner:", error);
      console.error("Error response:", error.response);
      const errorMessage = error.response?.data?.message || error.message || "Error saving banner. Please try again.";
      alert(errorMessage);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      link: banner.link || "",
      buttonText: banner.buttonText || "Shop Now",
      isActive: banner.isActive,
      order: banner.order || 0,
      startDate: banner.startDate
        ? new Date(banner.startDate).toISOString().split("T")[0]
        : "",
      endDate: banner.endDate
        ? new Date(banner.endDate).toISOString().split("T")[0]
        : "",
    });
    setImagePreview(`http://localhost:5000${banner.image}`);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await bannerAPI.delete(id);
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
        alert("Error deleting banner. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await bannerAPI.toggleStatus(id);
      fetchBanners();
    } catch (error) {
      console.error("Error toggling banner status:", error);
    }
  };

  const handleDragStart = (e, index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newBanners = [...banners];
    const draggedBanner = newBanners[dragIndex];
    newBanners.splice(dragIndex, 1);
    newBanners.splice(dropIndex, 0, draggedBanner);

    // Update order values
    const bannerOrders = newBanners.map((banner, index) => ({
      id: banner._id,
      order: index,
    }));

    try {
      await bannerAPI.reorder(bannerOrders);
      fetchBanners();
    } catch (error) {
      console.error("Error reordering banners:", error);
    }

    setDragIndex(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Banner Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage homepage banners and promotional content
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </button>
        </div>
      </div>

      {/* Banner Form */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Link URL
              </label>
              <div className="mt-1 relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Banner Image *
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    required={!editingBanner}
                  />
                </div>
                {imagePreview && (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Active</label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {editingBanner ? "Update Banner" : "Create Banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Banners
          </h3>

          {banners.length > 0 ? (
            <div className="space-y-4">
              {banners.map((banner, index) => (
                <div
                  key={banner._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 ${
                    dragIndex === index ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  </div>

                  <div className="flex-shrink-0 w-20 h-16 border rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5000${banner.image}`}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {banner.title}
                      </h4>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          banner.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {banner.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                      <span>Order: {banner.order}</span>
                      {banner.link && <span>• Has Link</span>}
                      {banner.startDate && (
                        <span>
                          • Starts:{" "}
                          {new Date(banner.startDate).toLocaleDateString()}
                        </span>
                      )}
                      {banner.endDate && (
                        <span>
                          • Ends:{" "}
                          {new Date(banner.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(banner._id)}
                      className="text-gray-400 hover:text-gray-600"
                      title={banner.isActive ? "Deactivate" : "Activate"}
                    >
                      {banner.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No banners
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first banner.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banners;
