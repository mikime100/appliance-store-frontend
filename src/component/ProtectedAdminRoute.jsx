import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

function ProtectedAdminRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");

      console.log("Checking authentication, token exists:", !!token);

      if (!token) {
        console.log("No token found, redirecting to login");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        console.log("Verifying token with backend");
        // Verify token with backend
        const response = await axios.get(`${API_BASE_URL}/api/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Token verification response:", response.data);

        if (response.data.success) {
          console.log("Token verified successfully");
          setIsAuthenticated(true);
        } else {
          console.log("Token verification failed");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        console.error("Error response:", error.response?.data);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
