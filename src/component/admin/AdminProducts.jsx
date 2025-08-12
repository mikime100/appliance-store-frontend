import React, { useState, useEffect, useRef, useCallback } from "react";
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
import TruncatedText from "../TruncatedText";
import { API_ENDPOINTS } from "../../config/api";

function AdminProducts({ onProductUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    text: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCTS);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      setShowDeleteModal(false);
      setProductToDelete(null);
      setToast({ open: true, type: "error", text: "Product deleted" });
    } catch (error) {
      console.error("Error deleting product:", error);
      setToast({ open: true, type: "error", text: "Failed to delete product" });
    }
  };

  const handleEdit = async (productId, updatedData) => {
    try {
      console.log("Sending update data:", updatedData); // Debug log
      const response = await axios.put(
        `${API_ENDPOINTS.PRODUCTS}/${productId}`,
        updatedData
      );
      console.log("Update response:", response.data); // Debug log
      setProducts(
        products.map((p) => (p._id === productId ? response.data : p))
      );
      setEditingProduct(null);
      setToast({ open: true, type: "success", text: "Product updated" });
    } catch (error) {
      console.error("Error updating product:", error);
      setToast({ open: true, type: "error", text: "Failed to update product" });
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-hide toast
  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(
      () => setToast((prev) => ({ ...prev, open: false })),
      2500
    );
    return () => clearTimeout(t);
  }, [toast.open]);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      {toast.open && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.text}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-md object-cover"
                        src={product.imageUrl}
                        alt={product.modelName}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.modelName}
                      </div>
                      <div className="text-sm text-gray-500">
                        <TruncatedText
                          text={product.description}
                          productId={product._id}
                          maxLines={2}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          product={productToDelete}
          onConfirm={() => handleDelete(productToDelete._id)}
          onCancel={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
        />
      )}
    </div>
  );
}

// Edit Product Modal Component
function EditProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    modelName: product.modelName,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    condition: product.condition || "A", // Default to A if not set
  });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (PNG, JPG, GIF)");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      return;
    }

    setNewImage(file);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newImage) {
      // Upload new image first
      setUploading(true);
      try {
        const imageData = new FormData();
        imageData.append("image", newImage);

        // Upload image to get the URL
        const uploadResponse = await axios.post(
          API_ENDPOINTS.ADMIN_IMAGE_UPLOAD,
          imageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${
                localStorage.getItem("adminToken") ||
                localStorage.getItem("token") ||
                ""
              }`,
            },
          }
        );

        // Update form data with new image URL
        const updatedFormData = {
          ...formData,
          imageUrl: uploadResponse.data.imageUrl,
        };

        onSave(product._id, updatedFormData);
      } catch (error) {
        console.error("Error uploading image:", error);
        console.error("Error response:", error.response?.data);
        alert(
          `Failed to upload image: ${
            error.response?.data?.error || error.message
          }`
        );
        setUploading(false);
        return;
      }
    } else {
      // No new image, just update other fields
      onSave(product._id, formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Product
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={formData.modelName}
                onChange={(e) =>
                  setFormData({ ...formData, modelName: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Condition
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
                A: Excellent, B: Good, C: Fair
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>

              {/* Current Image Display */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                <img
                  src={formData.imageUrl}
                  alt="Current product"
                  className="h-20 w-20 object-cover rounded-md border"
                />
              </div>

              {/* New Image Upload */}
              <div
                ref={dropZoneRef}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-16 w-16 object-cover rounded-md shadow-md"
                      />
                      <p className="text-xs text-gray-600 mt-1 font-medium">
                        {newImage.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(newImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewImage(null);
                          setImagePreview(null);
                        }}
                        className="mt-1 text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className={`mx-auto h-8 w-8 ${
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
                        className={`text-xs ${
                          isDragOver ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {isDragOver
                          ? "Drop new image here"
                          : "Click to upload new image or drag and drop"}
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
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep current image
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ product, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delete Product
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete "{product?.modelName}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
