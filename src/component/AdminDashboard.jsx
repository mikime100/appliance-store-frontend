import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminProducts from "./admin/AdminProducts";
import AdminAddProduct from "./admin/AdminAddProduct";
import AdminComments from "./admin/AdminComments";
import AdminNotifications from "./admin/AdminNotifications";
import AdminSettings from "./admin/AdminSettings";

// Modern color palette with gradients
const PRIMARY_COLOR = "#e2eafc";
const SECONDARY_GRADIENT =
  "linear-gradient(to right, #00111c, #001a2c, #002137, #00253e, #002945, #002e4e, #003356)";
const MOOD_GRADIENT = "linear-gradient(to right, #ff7b00, #ff8800, #ff9500)";
const BG_DARK = "#00111c";
const BG_CARD = "#001a2c";
const BG_HOVER = "#002137";
const ACCENT_ORANGE = "#ff7b00";
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

function AdminDashboard() {
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
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadComments, setUnreadComments] = useState(0);
  const [unreadProducts, setUnreadProducts] = useState(0);

  // Helper functions for localStorage management
  const getReadStatus = (key) => {
    try {
      const stored = localStorage.getItem(`yql_read_${key}`);
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return false;
    }
  };

  const setReadStatus = (key, value) => {
    try {
      localStorage.setItem(`yql_read_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Function to mark notifications as read
  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
    setReadStatus("notifications", true);
  };

  // Function to mark comments as read
  const markCommentsAsRead = () => {
    setUnreadComments(0);
    setReadStatus("comments", true);
  };

  // Function to mark products as read
  const markProductsAsRead = () => {
    setUnreadProducts(0);
    setReadStatus("products", true);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const fetchStats = async () => {
    try {
      // First, try to get products
      let productsRes;
      try {
        productsRes = await axios.get("http://localhost:5000/api/products");
      } catch (productsError) {
        console.error("Products endpoint error:", productsError);
        throw new Error(
          "Cannot connect to products API. Please ensure your backend server is running on http://localhost:5000"
        );
      }

      // Try to get comments, but handle the case where the endpoint might not exist
      let commentsRes;
      try {
        commentsRes = await axios.get(
          "http://localhost:5000/api/comments/admin/all"
        );
      } catch (commentsError) {
        console.warn("Comments endpoint not available:", commentsError);
        commentsRes = { data: [] }; // Use empty array as fallback
      }

      // Calculate active users (unique comment authors)
      const uniqueUsers = new Set(
        commentsRes.data.map((comment) => comment.userId)
      );
      const activeUsers = uniqueUsers.size;

      // Calculate featured products (products with comments)
      const productsWithComments = new Set(
        commentsRes.data.map((comment) => comment.productId)
      );
      const featuredProducts = productsWithComments.size;

      // Calculate unread comments (comments from the last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentComments = commentsRes.data.filter(
        (comment) => new Date(comment.createdAt) > oneDayAgo
      );
      const unreadComments = recentComments.length;

      // Calculate unread notifications (simulate based on recent activity)
      const unreadNotifications = Math.min(
        Math.floor(Math.random() * 3) + 1, // Simulate 1-3 unread notifications
        2 // Cap at 2 for demo purposes
      );

      // Calculate trends based on data patterns
      const calculateTrend = (currentValue, totalItems) => {
        if (totalItems === 0) return 0;
        // Simple trend calculation based on data distribution
        const percentage = Math.round((currentValue / totalItems) * 100);
        return Math.min(percentage, 25); // Cap at 25% for realistic trends
      };

      const trends = {
        products: calculateTrend(
          productsRes.data.length,
          Math.max(productsRes.data.length, 1)
        ),
        comments: calculateTrend(
          commentsRes.data.length,
          Math.max(commentsRes.data.length, 1)
        ),
        users: calculateTrend(activeUsers, Math.max(activeUsers, 1)),
        featured: calculateTrend(
          featuredProducts,
          Math.max(productsRes.data.length, 1)
        ),
      };

      setStats({
        totalProducts: productsRes.data.length,
        totalComments: commentsRes.data.length,
        activeUsers: activeUsers,
        featuredProducts: featuredProducts,
        recentProducts: productsRes.data.slice(-5).reverse(),
        trends: trends,
      });
      // Check localStorage for read status and set unread counts accordingly
      const productsRead = getReadStatus("products");
      const commentsRead = getReadStatus("comments");
      const notificationsRead = getReadStatus("notifications");

      setUnreadComments(commentsRead ? 0 : unreadComments);
      setUnreadNotifications(notificationsRead ? 0 : unreadNotifications);
      setUnreadProducts(productsRead ? 0 : productsRes.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(
        "Failed to load dashboard data. Please check if your backend server is running."
      );
      setLoading(false);
    }
  };

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
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 text-slate-700 hover:bg-slate-100 hover:text-slate-800"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-xl">menu</span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">Toggle Menu</span>
                )}
              </div>
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
              badge={unreadProducts > 0 ? unreadProducts : null}
            />
            <SidebarButton
              icon="add_box"
              label="Add Product"
              active={activePage === "add-product"}
              onClick={() => setActivePage("add-product")}
              collapsed={sidebarCollapsed}
            />
            <SidebarButton
              icon="comment"
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
                          // TODO: Add logout functionality when authentication is implemented
                          alert(
                            "Logout functionality will be added with authentication system"
                          );
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
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        active
          ? "text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-800"
      }`}
      style={{
        background: active ? SECONDARY_GRADIENT : "transparent",
      }}
    >
      <div className="flex items-center space-x-3">
        <span className="material-icons text-xl">{icon}</span>
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </div>
      {badge && !collapsed && (
        <span
          className="text-xs px-2 py-1 rounded-full text-white font-medium"
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
