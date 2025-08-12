import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import { FaReply, FaEdit, FaTrash, FaUser, FaCrown } from "react-icons/fa";
import CommentForm from "./CommentForm";

const CommentItem = ({
  comment,
  onUpdate,
  onDelete,
  onReply,
  currentUserId,
  isAdmin = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const commentRef = useRef(null);

  const canEdit = comment.userId === currentUserId || isAdmin;
  const canDelete = comment.userId === currentUserId || isAdmin;

  useEffect(() => {
    // Animate comment appearance
    if (commentRef.current) {
      gsap.fromTo(
        commentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now - date) / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete(API_ENDPOINTS.COMMENT_BY_ID(comment._id), {
        data: { userId: currentUserId, isAdmin },
      });

      // Animate deletion
      gsap.to(commentRef.current, {
        opacity: 0,
        x: -100,
        duration: 0.3,
        onComplete: () => {
          onDelete(comment._id);
        },
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = (updatedComment) => {
    setIsEditing(false);
    onUpdate(updatedComment);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(comment._id);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div
      ref={commentRef}
      className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200"
      style={{ borderColor: "rgba(15, 23, 42, 0.2)" }}
    >
      {isEditing ? (
        <CommentForm
          productId={comment.productId}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          editComment={comment}
          isAdmin={isAdmin}
        />
      ) : (
        <>
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                {comment.isAdmin ? (
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <FaCrown className="text-white text-xs" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                    <FaUser className="text-slate-600 text-xs" />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-800">
                    {comment.isAdmin ? "YQL Store" : comment.userName}
                  </span>
                  {comment.isAdmin && (
                    <div className="flex items-center space-x-1">
                      <FaCrown className="text-blue-500 text-xs" />
                      <span className="text-xs text-blue-600 font-medium">
                        Verified
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span>{formatDate(comment.createdAt)}</span>
              {comment.edited && (
                <span className="text-slate-400">(edited)</span>
              )}
            </div>
          </div>

          {/* Comment Content */}
          <div className="mb-4">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReply}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <FaReply className="text-xs" />
                <span className="text-sm">Reply</span>
              </button>

              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <FaEdit className="text-xs" />
                  <span className="text-sm">Edit</span>
                </button>
              )}

              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                >
                  <FaTrash className="text-xs" />
                  <span className="text-sm">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </span>
                </button>
              )}
            </div>

            {/* Replies Toggle */}
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={toggleReplies}
                className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                {showReplies ? "Hide" : "Show"} {comment.replies.length} repl
                {comment.replies.length === 1 ? "y" : "ies"}
              </button>
            )}
          </div>

          {/* Replies Section */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-slate-200 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onReply={onReply}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentItem;
