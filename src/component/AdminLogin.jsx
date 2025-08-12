import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import API_BASE_URL from "../config/api";

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Attempting login with:", formData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/login`,
        formData
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data.user));

        console.log("Login successful, redirecting to admin dashboard");
        // Redirect to admin dashboard
        navigate("/admin");
      } else {
        console.log("Login failed:", response.data.message);
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top left module */}
        <div className="absolute top-8 left-8 w-32 h-16 bg-gray-800/50 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-center h-full space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>

        {/* Top right module */}
        <div className="absolute top-8 right-8 w-32 h-16 bg-gray-800/50 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-center h-full space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>

        {/* Connecting lines */}
        <div className="absolute top-16 left-40 w-32 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
        <div className="absolute top-16 right-40 w-32 h-px bg-gradient-to-l from-cyan-400/50 to-transparent"></div>

        {/* Circuit traces */}
        <div className="absolute left-1/4 top-1/3 w-px h-32 bg-gradient-to-b from-cyan-400/20 to-transparent"></div>
        <div className="absolute right-1/4 top-1/3 w-px h-32 bg-gradient-to-b from-cyan-400/20 to-transparent"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <img
                src={require("./images/YQL LOGO.png")}
                alt="YQL Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* Loading dots */}
            <div className="flex justify-center space-x-1 mb-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Access your admin dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-lg py-2 px-3">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">YQL Appliances Admin Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
