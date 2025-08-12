import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminProducts from "./admin/AdminProducts";
import AdminAddProduct from "./admin/AdminAddProduct";
import AdminComments from "./admin/AdminComments";
import AdminNotifications from "./admin/AdminNotifications";
import AdminSettings from "./admin/AdminSettings";
import { API_ENDPOINTS } from "../config/api";

// Color constants
const PRIMARY_COLOR = "#FEFEFF";
const SECONDARY_GRADIENT = "linear-gradient(135deg, #023047 0%, #0f4c75 100%)";
const MOOD_GRADIENT = "linear-gradient(135deg, #fb8500 0%, #ff9e00 100%)";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalComments: 0,
    activeUsers: 0,
    featuredProducts: 0,
    recentProducts: [],
    trends: {
      products: 0,
      comments: 0,
      users: 0,
      featured: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Read status management
  const getReadStatus = (key) => {
    return localStorage.getItem(`read_${key}`) === "true";
  };

  const setReadStatus = (key, value) => {
    localStorage.setItem(`read_${key}`, value.toString());
  };

  const unreadComments = getReadStatus("comments") ? 0 : 5;
  const unreadNotifications = getReadStatus("notifications") ? 0 : 3;

  const markNotificationsAsRead = () => {
    setReadStatus("notifications", true);
  };

  const markCommentsAsRead = () => {
    setReadStatus("comments", true);
  };

  const markProductsAsRead = () => {
    setReadStatus("products", true);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch products
      let productsRes;
      try {
        productsRes = await axios.get(API_ENDPOINTS.PRODUCTS);
      } catch (productsError) {
        console.error("Products endpoint error:", productsError);
        throw new Error(
          `Cannot connect to products API. Please ensure your backend server is running at ${API_ENDPOINTS.PRODUCTS}`
        );
      }

      // Fetch comments
      let commentsRes;
      try {
        commentsRes = await axios.get(API_ENDPOINTS.ADMIN_ALL_COMMENTS);
      } catch (commentsError) {
        console.error("Comments endpoint error:", commentsError);
        // Continue with default values if comments fail
        commentsRes = { data: [] };
      }

      const products = productsRes.data || [];
      const comments = commentsRes.data || [];

      // Calculate trends (simplified for demo)
      const calculateTrend = (currentValue, totalItems) => {
        if (totalItems === 0) return 0;
        return Math.round((currentValue / totalItems) * 100);
      };

      // Sort newest first by createdAt (fallback to id or default)
      const sortedByRecent = [...products]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 10);

      const newStats = {
        totalProducts: products.length,
        totalComments: comments.length,
        activeUsers: Math.floor(Math.random() * 50) + 10, // Demo data
        featuredProducts: Math.floor(products.length * 0.2),
        recentProducts: sortedByRecent,
        trends: {
          products: calculateTrend(products.length, 100),
          comments: calculateTrend(comments.length, 50),
          users: Math.floor(Math.random() * 20) + 5,
          featured: calculateTrend(Math.floor(products.length * 0.2), 20),
        },
      };

      setStats(newStats);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 60 * 1000); // periodic safety refresh
    return () => clearInterval(id);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <DashboardOverview stats={stats} setActivePage={setActivePage} />
        );
      case "products":
        return <AdminProducts onProductUpdate={fetchStats} />;
      case "add-product":
        return <AdminAddProduct onProductAdded={fetchStats} />;
      case "comments":
        return <AdminComments />;
      case "notifications":
        return <AdminNotifications />;
      case "settings":
        return <AdminSettings />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: PRIMARY_COLOR }}
      >
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="text-slate-800 text-lg">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: PRIMARY_COLOR }}
      >
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-slate-800 text-lg mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: PRIMARY_COLOR }}>
      {/* Modern Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } transition-all duration-300 ease-in-out bg-white/80 backdrop-blur-xl border-r border-slate-300 shadow-lg`}
        style={{ borderRightColor: "rgba(15, 23, 42, 0.3)" }}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={require("./images/YQL LOGO.png")}
                alt="YQL Logo"
                className="w-full h-full object-contain"
              />
            </div>
            {!sidebarCollapsed && (
              <span className="text-slate-800 font-semibold text-xl">YQL</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {/* Burger Menu Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 text-slate-700 hover:bg-slate-100 hover:text-slate-800 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
            >
              <span className="material-icons text-xl mr-3 w-6 text-center">
                menu
              </span>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">Toggle Menu</span>
              )}
            </button>

            <SidebarButton
              icon="dashboard"
              label="Dashboard"
              active={activePage === "dashboard"}
              onClick={() => setActivePage("dashboard")}
              collapsed={sidebarCollapsed}
            />

            <SidebarButton
              icon="inventory_2"
              label="Products"
              active={activePage === "products"}
              onClick={() => {
                setActivePage("products");
                markProductsAsRead();
              }}
              collapsed={sidebarCollapsed}
            />

            <SidebarButton
              icon="add_circle"
              label="Add Product"
              active={activePage === "add-product"}
              onClick={() => setActivePage("add-product")}
              collapsed={sidebarCollapsed}
            />

            <SidebarButton
              icon="comments"
              label="Comments"
              active={activePage === "comments"}
              onClick={() => {
                setActivePage("comments");
                markCommentsAsRead();
              }}
              collapsed={sidebarCollapsed}
              badge={unreadComments > 0 ? unreadComments : null}
            />

            <SidebarButton
              icon="notifications"
              label="Notifications"
              active={activePage === "notifications"}
              onClick={() => {
                setActivePage("notifications");
                markNotificationsAsRead();
              }}
              collapsed={sidebarCollapsed}
              badge={unreadNotifications > 0 ? unreadNotifications : null}
            />

            <SidebarButton
              icon="settings"
              label="Settings"
              active={activePage === "settings"}
              onClick={() => setActivePage("settings")}
              collapsed={sidebarCollapsed}
            />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Modern Header */}
        <header
          className="bg-white/80 backdrop-blur-xl border-b border-slate-300 px-8 py-4 shadow-sm relative z-50"
          style={{ borderBottomColor: "rgba(15, 23, 42, 0.3)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-slate-800 text-2xl font-semibold">
                {activePage === "dashboard" && "Dashboard"}
                {activePage === "products" && "Products"}
                {activePage === "add-product" && "Add Product"}
                {activePage === "comments" && "Comments"}
                {activePage === "notifications" && "Notifications"}
                {activePage === "settings" && "Settings"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                onClick={() => {
                  setActivePage("notifications");
                  markNotificationsAsRead();
                }}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                style={{ borderColor: "rgba(15, 23, 42, 0.2)" }}
              >
                <span className="material-icons text-slate-700">
                  notifications
                </span>
                {unreadNotifications > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                    style={{ background: MOOD_GRADIENT }}
                  >
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <div
                className="relative profile-dropdown"
                style={{ zIndex: 99999 }}
              >
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                  style={{ borderColor: "rgba(15, 23, 42, 0.2)" }}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Admin"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-slate-700 font-medium">Admin</span>
                  <span className="material-icons text-slate-700 text-sm">
                    expand_more
                  </span>
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200"
                    style={{ zIndex: 99999 }}
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-slate-800 font-medium">
                              Admin User
                            </p>
                            <p className="text-slate-500 text-sm">
                              admin@yql.com
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActivePage("settings")}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2"
                      >
                        <span className="material-icons text-sm">settings</span>
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          localStorage.removeItem("adminToken");
                          localStorage.removeItem("adminUser");
                          navigate("/admin/login");
                        }}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2"
                      >
                        <span className="material-icons text-sm">logout</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick, collapsed, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-slate-100 hover:shadow-sm hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 ${
        active
          ? "text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-800"
      }`}
      style={{
        background: active ? SECONDARY_GRADIENT : "transparent",
      }}
    >
      <span className="material-icons text-xl mr-3 w-6 text-center">
        {icon}
      </span>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
      {badge && !collapsed && (
        <span
          className="ml-auto text-xs px-2 py-1 rounded-full text-white font-medium"
          style={{ background: MOOD_GRADIENT }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// Modern Dashboard Overview
function DashboardOverview({ stats, setActivePage }) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="inventory_2"
          label="Total Products"
          value={stats.totalProducts}
          trend={`+${stats.trends.products}%`}
          trendUp={stats.trends.products > 0}
        />
        <StatCard
          icon="comment"
          label="Total Comments"
          value={stats.totalComments}
          trend={`+${stats.trends.comments}%`}
          trendUp={stats.trends.comments > 0}
        />
        <StatCard
          icon="group"
          label="Active Users"
          value={stats.activeUsers}
          trend={`+${stats.trends.users}%`}
          trendUp={stats.trends.users > 0}
        />
        <StatCard
          icon="star"
          label="Featured"
          value={stats.featuredProducts}
          trend={`+${stats.trends.featured}%`}
          trendUp={stats.trends.featured > 0}
        />
      </div>

      {/* Recent Products */}
      <div
        className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-300 p-6 shadow-lg"
        style={{ borderColor: "rgba(15, 23, 42, 0.3)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-800 text-xl font-semibold">
            Recent Products
          </h3>
          <button
            onClick={() => setActivePage("products")}
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            View All
          </button>
        </div>

        {stats.recentProducts.length > 0 ? (
          <div className="space-y-4">
            {stats.recentProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
                style={{ borderColor: "rgba(15, 23, 42, 0.2)" }}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.imageUrl}
                    alt={product.modelName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-slate-800 font-medium">
                      {product.modelName}
                    </p>
                    <p className="text-slate-600 text-sm">${product.price}</p>
                  </div>
                </div>
                <span className="text-slate-500 text-sm">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="material-icons text-slate-400 text-4xl mb-4">
              inventory_2
            </span>
            <p className="text-slate-500">No products yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Modern Stat Card
function StatCard({ icon, label, value, trend, trendUp }) {
  const displayTrend = trend === "+0%" ? "N/A" : trend;
  const showTrend = trend !== "+0%";
  return (
    <div
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-300 p-6 hover:bg-white/90 transition-all duration-300 group shadow-lg"
      style={{ borderColor: "rgba(15, 23, 42, 0.3)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: MOOD_GRADIENT }}
        >
          <span className="material-icons text-white text-xl">{icon}</span>
        </div>
        {showTrend && (
          <div
            className={`flex items-center space-x-1 text-sm ${
              trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            <span className="material-icons text-sm">
              {trendUp ? "trending_up" : "trending_down"}
            </span>
            <span>{displayTrend}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-slate-600 text-sm mb-1">{label}</p>
        <p className="text-slate-800 text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
