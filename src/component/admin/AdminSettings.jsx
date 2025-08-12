import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
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

function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(response.data.message || "Failed to change password");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    // Add clear data functionality here
    alert("Clear data functionality would be implemented here");
    setShowClearModal(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Admin Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Change Admin Login Password
          </h3>

          {message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Login Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Login Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Login Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* System Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            System Information
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Application Name:
              </span>
              <span className="text-sm text-gray-900">
                Used Appliances Store
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Version:
              </span>
              <span className="text-sm text-gray-900">1.0.0</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Database:
              </span>
              <span className="text-sm text-gray-900">MongoDB Atlas</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Image Storage:
              </span>
              <span className="text-sm text-gray-900">Cloudinary</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Backend:
              </span>
              <span className="text-sm text-gray-900">Node.js + Express</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Frontend:
              </span>
              <span className="text-sm text-gray-900">
                React + Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.open(window.location.origin, "_blank")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-sm font-medium text-gray-900">
                View Website
              </div>
              <div className="text-xs text-gray-500">Open main site</div>
            </div>
          </button>

          <button
            onClick={() =>
              window.open(
                `${
                  process.env.REACT_APP_API_URL || "http://localhost:5000"
                }/api/products`,
                "_blank"
              )
            }
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">
                API Endpoints
              </div>
              <div className="text-xs text-gray-500">View API data</div>
            </div>
          </button>

          <button
            onClick={() => setShowClearModal(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🗑️</div>
              <div className="text-sm font-medium text-gray-900">
                Clear Data
              </div>
              <div className="text-xs text-gray-500">Reset database</div>
            </div>
          </button>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>
              Are you sure you want to clear all data? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleClearData}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, clear data
              </button>
              <button
                onClick={() => setShowClearModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
