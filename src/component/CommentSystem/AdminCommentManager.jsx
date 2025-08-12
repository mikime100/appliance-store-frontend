import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gsap } from "gsap";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import {
  FaComment,
  FaTrash,
  FaEdit,
  FaSearch,
  FaFilter,
  FaCrown,
  FaUser,
} from "react-icons/fa";
import CommentForm from "./CommentForm";

const AdminCommentManager = () => {
  const [selectedComment, setSelectedComment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, admin, user
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [products, setProducts] = useState([]);
  const queryClient = useQueryClient();

  // Fetch all comments for admin
  const {
    data: comments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.ADMIN_ALL_COMMENTS);
      return response.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch products for filtering
  const { data: productsData = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.PRODUCTS);
      return response.data;
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      await axios.delete(API_ENDPOINTS.COMMENT_BY_ID(commentId), {
        data: { userId: "admin", isAdmin: true },
      });
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-comments"]);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment. Please try again.");
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, data }) => {
      const response = await axios.put(API_ENDPOINTS.COMMENT_BY_ID(commentId), {
        ...data,
        userId: "admin",
        isAdmin: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-comments"]);
      setIsEditing(false);
      setSelectedComment(null);
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
      alert("Error updating comment. Please try again.");
    },
  });

  // Filter and search comments
  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "admin" && comment.isAdmin) ||
      (filterType === "user" && !comment.isAdmin);

    const matchesProduct =
      selectedProduct === "all" || comment.productId === selectedProduct;

    return matchesSearch && matchesFilter && matchesProduct;
  });

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    deleteCommentMutation.mutate(commentId);
  };

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setIsEditing(true);
  };

  const handleEditSubmit = (updatedComment) => {
    updateCommentMutation.mutate({
      commentId: selectedComment._id,
      data: {
        content: updatedComment.content,
        userName: updatedComment.userName,
      },
    });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setSelectedComment(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Animate comment list
  useEffect(() => {
    const commentElements = document.querySelectorAll(".admin-comment-item");
    gsap.fromTo(
      commentElements,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
    );
  }, [filteredComments]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">
          Error loading comments. Please try again.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaComment className="text-orange-500" />
          <h2 className="text-2xl font-semibold text-slate-800">
            Comment Management
          </h2>
        </div>
        <div className="text-sm text-slate-600">
          Total Comments: {comments.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Comments
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by content or user..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter by type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Comments</option>
              <option value="admin">Admin Comments</option>
              <option value="user">User Comments</option>
            </select>
          </div>

          {/* Filter by product */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              {productsData.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.modelName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && selectedComment && (
        <CommentForm
          productId={selectedComment.productId}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          editComment={selectedComment}
          isAdmin={true}
        />
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-slate-600">Loading comments...</span>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-8">
            <FaComment className="text-slate-300 text-4xl mx-auto mb-4" />
            <p className="text-slate-500">
              No comments found matching your criteria.
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment._id}
              className="admin-comment-item bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {comment.isAdmin ? (
                    <FaCrown className="text-orange-500 text-sm" />
                  ) : (
                    <FaUser className="text-slate-400 text-sm" />
                  )}
                  <span className="font-medium text-slate-800">
                    {comment.userName}
                  </span>
                  {comment.isAdmin && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs text-slate-500">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.edited && (
                    <span className="text-xs text-slate-400">(edited)</span>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              <div className="mb-4">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {/* Product Info */}
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Product:</strong>{" "}
                  {productsData.find((p) => p._id === comment.productId)
                    ?.modelName || "Unknown Product"}
                </p>
              </div>

              {/* Admin Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <FaEdit className="text-xs" />
                    <span className="text-sm">Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(comment._id)}
                    disabled={deleteCommentMutation.isPending}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                  >
                    <FaTrash className="text-xs" />
                    <span className="text-sm">
                      {deleteCommentMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </span>
                  </button>
                </div>

                <div className="text-xs text-slate-500">ID: {comment._id}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading overlay */}
      {(deleteCommentMutation.isPending || updateCommentMutation.isPending) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span>Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommentManager;
