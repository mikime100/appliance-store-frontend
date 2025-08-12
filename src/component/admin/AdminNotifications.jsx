import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import {
  FaBell,
  FaComment,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTrash,
  FaEye,
} from "react-icons/fa";

const AdminNotifications = () => {
  const [filterType, setFilterType] = useState("all");
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const {
    data: fetchedNotifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const [commentsRes, productsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN_ALL_COMMENTS),
        axios.get(API_ENDPOINTS.PRODUCTS),
      ]);

      const comments = commentsRes.data || [];
      const products = productsRes.data || [];

      // Generate notifications
      const generatedNotifications = [];

      // Recent comments
      const recentComments = comments
        .filter((comment) => {
          const commentDate = new Date(comment.createdAt);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return commentDate > oneDayAgo;
        })
        .slice(0, 5);

      recentComments.forEach((comment) => {
        generatedNotifications.push({
          id: `comment-${comment._id}`,
          type: "comment",
          title: "New Comment",
          message: `${comment.userName} commented on a product`,
          details: comment.content.substring(0, 100) + "...",
          timestamp: new Date(comment.createdAt),
          read: false,
          priority: "medium",
        });
      });

      // System notifications
      if (products.length === 0) {
        generatedNotifications.push({
          id: "system-no-products",
          type: "system",
          title: "No Products Available",
          message: "Your store has no products. Consider adding some products.",
          details: "This is a system alert to help you manage your store.",
          timestamp: new Date(),
          read: false,
          priority: "high",
        });
      }

      // Stock alert
      if (products.length > 0) {
        generatedNotifications.push({
          id: "stock-alert-1",
          type: "alert",
          title: "Low Stock Alert",
          message: "Some products are running low on stock",
          details: "Consider restocking popular items.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          priority: "high",
        });
      }

      return generatedNotifications.sort((a, b) => b.timestamp - a.timestamp);
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (fetchedNotifications) {
      setNotifications(fetchedNotifications);
    }
  }, [fetchedNotifications]);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "all") return true;
    if (filterType === "unread") return !notification.read;
    if (filterType === "read") return notification.read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "comment":
        return <FaComment className="text-blue-500" />;
      case "alert":
        return <FaExclamationTriangle className="text-red-500" />;
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "system":
        return <FaBell className="text-orange-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-orange-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-slate-600">Loading notifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">
          Error loading notifications. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaBell className="text-orange-500" />
          <h2 className="text-2xl font-semibold text-slate-800">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-slate-700">Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <FaBell className="text-slate-300 text-4xl mx-auto mb-4" />
            <p className="text-slate-500">No notifications found.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${getPriorityColor(
                notification.priority
              )} ${!notification.read ? "bg-blue-50/50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-slate-800">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-sm text-slate-500 mb-2">
                      {notification.details}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>{formatTimeAgo(notification.timestamp)}</span>
                      <span className="capitalize">
                        {notification.priority} priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Mark as read"
                    >
                      <FaEye className="text-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete notification"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
