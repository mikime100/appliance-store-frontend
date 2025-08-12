import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import {
  PRIMARY,
  SECONDARY,
  BG_LIGHT,
  BG_CARD,
  ACCENT,
  STAT_CARD_BG,
  BUTTON_DANGER,
  BUTTON_NEUTRAL,
  HEADING_TEXT,
  SUBHEADING_TEXT,
} from "../AdminDashboard";
import { API_ENDPOINTS } from "../../config/api";

function AdminAddProduct({ onProductAdded }) {
  const [formData, setFormData] = useState({
    modelName: "",
    description: "",
    price: "",
    condition: "A", // Default to A (Excellent)
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    text: "",
  });
  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        image: "Please select a valid image file (PNG, JPG, GIF)",
      });
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors({ ...errors, image: "File size must be less than 10MB" });
      return;
    }

    setImage(file);
    setErrors({ ...errors, image: "" });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.modelName.trim()) {
      newErrors.modelName = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!image) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("modelName", formData.modelName);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("condition", formData.condition);
      data.append("image", image);

      const response = await axios.post(API_ENDPOINTS.ADMIN_UPLOAD, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${
            localStorage.getItem("adminToken") ||
            localStorage.getItem("token") ||
            ""
          }`,
        },
      });

      setToast({
        open: true,
        type: "success",
        text: "Product uploaded successfully!",
      });
      setMessage("");
      setFormData({
        modelName: "",
        description: "",
        price: "",
        condition: "A",
      });
      setImage(null);
      setImagePreview(null);
      setErrors({});
      // Trigger parent dashboard refresh so Recent Products updates immediately
      if (typeof onProductAdded === "function") {
        try {
          onProductAdded();
        } catch (e) {
          // no-op if parent not provided
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Upload failed. Please try again.";
      setToast({ open: true, type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(
      () => setToast((prev) => ({ ...prev, open: false })),
      3000
    );
    return () => clearTimeout(t);
  }, [toast.open]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Add New Product</h2>

      {/* Toast Notification */}
      {toast.open && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="modelName"
                value={formData.modelName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.modelName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product name"
              />
              {errors.modelName && (
                <p className="mt-1 text-sm text-red-600">{errors.modelName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Condition *
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: "A" })}
                  className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                    formData.condition === "A"
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: "B" })}
                  className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                    formData.condition === "B"
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: "C" })}
                  className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                    formData.condition === "C"
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  C
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                A: Brand New, B: Used Good, C: Used Fair
              </p>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image *
              </label>
              <div
                ref={dropZoneRef}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : errors.image
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-md shadow-md"
                      />
                      <p className="text-sm text-gray-600 mt-2 font-medium">
                        {image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                          setImagePreview(null);
                          setErrors({ ...errors, image: "" });
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className={`mx-auto h-12 w-12 ${
                          isDragOver ? "text-blue-400" : "text-gray-400"
                        }`}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p
                        className={`text-sm ${
                          isDragOver ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {isDragOver
                          ? "Drop image here"
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </div>
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Upload Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  "Upload Product"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminAddProduct;
