import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import {
  FaComment,
  FaReply,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaBold,
  FaItalic,
  FaUnderline,
  FaPaperclip,
  FaImage,
  FaSmile,
  FaAt,
  FaCrown,
} from "react-icons/fa";

const AdminCommentInterface = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch products for selection
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.PRODUCTS);
      return response.data;
    },
  });

  // Fetch comments for selected product
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["product-comments", selectedProduct?._id],
    queryFn: async () => {
      if (!selectedProduct) return [];
      const response = await axios.get(
        API_ENDPOINTS.COMMENTS_BY_PRODUCT(selectedProduct._id)
      );
      return response.data;
    },
    enabled: !!selectedProduct,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (commentData) => {
      const response = await axios.post(
        API_ENDPOINTS.COMMENTS_BY_PRODUCT(selectedProduct._id),
        {
          ...commentData,
          userId: "admin",
          userName: "YQL Store",
          isAdmin: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["product-comments", selectedProduct?._id]);
      setCommentContent("");
      setReplyingTo(null);
      setShowForm(false);
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      alert("Error adding comment. Please try again.");
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }) => {
      const response = await axios.put(API_ENDPOINTS.COMMENT_BY_ID(commentId), {
        content,
        userId: "admin",
        isAdmin: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["product-comments", selectedProduct?._id]);
      setEditingComment(null);
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
      alert("Error updating comment. Please try again.");
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
      queryClient.invalidateQueries(["product-comments", selectedProduct?._id]);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment. Please try again.");
    },
  });

  const handleSubmitComment = () => {
    if (!commentContent.trim()) return;

    addCommentMutation.mutate({
      content: commentContent.trim(),
      parentCommentId: replyingTo?._id || null,
    });
  };

  const handleUpdateComment = (commentId, content) => {
    updateCommentMutation.mutate({ commentId, content });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderComment = (comment, isReply = false) => (
    <div
      key={comment._id}
      className={`bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        isReply ? "ml-8 border-l-4 border-l-orange-500" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {comment.isAdmin ? (
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
              <FaCrown className="text-white text-sm" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
              <span className="text-slate-600 font-medium text-sm">
                {comment.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-slate-800">
              {comment.userName}
            </span>
            {comment.isAdmin && (
              <div className="flex items-center space-x-1">
                <FaCheck className="text-blue-500 text-xs" />
                <span className="text-xs text-blue-600 font-medium">
                  Verified
                </span>
              </div>
            )}
            <span className="text-xs text-slate-500">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.edited && (
              <span className="text-xs text-slate-400">(edited)</span>
            )}
          </div>

          {editingComment?._id === comment._id ? (
            <div className="space-y-2">
              <textarea
                value={editingComment.content}
                onChange={(e) =>
                  setEditingComment({
                    ...editingComment,
                    content: e.target.value,
                  })
                }
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleUpdateComment(comment._id, editingComment.content)
                  }
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                >
                  <FaCheck className="inline mr-1" />
                  Save
                </button>
                <button
                  onClick={() => setEditingComment(null)}
                  className="px-3 py-1 bg-slate-500 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors"
                >
                  <FaTimes className="inline mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-3">
                {comment.content}
              </p>

              <div className="flex items-center space-x-4 text-sm">
                <button
                  onClick={() => setReplyingTo(comment)}
                  className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <FaReply className="text-xs" />
                  <span>Reply</span>
                </button>

                {comment.isAdmin && (
                  <>
                    <button
                      onClick={() =>
                        setEditingComment({
                          _id: comment._id,
                          content: comment.content,
                        })
                      }
                      className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      <FaEdit className="text-xs" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FaTrash className="text-xs" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-slate-600">Loading products...</span>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">
          Error loading products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <FaComment className="text-orange-500" />
        <h2 className="text-2xl font-semibold text-slate-800">
          Admin Comment Interface
        </h2>
      </div>

      {/* Product Selection */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Select Product to Comment On
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => setSelectedProduct(product)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedProduct?._id === product._id
                  ? "border-orange-500 bg-orange-50"
                  : "border-slate-200 hover:border-orange-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-600 font-medium text-sm">
                    {product.modelName.substring(0, 4).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate">
                    {product.modelName}
                  </h4>
                  <p className="text-sm text-slate-600 truncate">
                    ${product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Section */}
      {selectedProduct && (
        <div className="space-y-6">
          {/* Comment Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Comment on: {selectedProduct.modelName}
              </h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                {showForm ? "Cancel" : "Add Comment"}
              </button>
            </div>

            {showForm && (
              <div className="space-y-4">
                {replyingTo && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-800">
                      Replying to: {replyingTo.userName}
                    </p>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-xs text-orange-600 hover:text-orange-800 mt-1"
                    >
                      Cancel reply
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Add comment..."
                    className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={4}
                  />

                  {/* Formatting Toolbar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                        <FaBold />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                        <FaItalic />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                        <FaUnderline />
                      </button>
                      <div className="w-px h-4 bg-slate-300"></div>
                      <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                        <FaPaperclip />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                        <FaImage />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                        <FaSmile />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                        <FaAt />
                      </button>
                    </div>

                    <button
                      onClick={handleSubmitComment}
                      disabled={
                        !commentContent.trim() || addCommentMutation.isPending
                      }
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addCommentMutation.isPending
                        ? "Submitting..."
                        : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                Comments ({comments.length})
              </h3>
              <select className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Most recent</option>
                <option>Oldest first</option>
              </select>
            </div>

            {commentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-slate-600">Loading comments...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <FaComment className="text-slate-300 text-4xl mx-auto mb-4" />
                <p className="text-slate-500">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => renderComment(comment))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommentInterface;
