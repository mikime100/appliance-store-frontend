import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gsap } from "gsap";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import { FaComment, FaPlus, FaSpinner } from "react-icons/fa";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const CommentSystem = ({
  productId,
  isAdmin = false,
  autoShowForm = false,
}) => {
  const [showForm, setShowForm] = useState(autoShowForm);
  const [replyingTo, setReplyingTo] = useState(null);
  const [currentUserId] = useState(
    () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const containerRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch comments with React Query
  const {
    data: comments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["comments", productId],
    queryFn: async () => {
      const response = await axios.get(
        API_ENDPOINTS.COMMENTS_BY_PRODUCT(productId)
      );
      return response.data;
    },
    refetchInterval: 5000, // Real-time updates every 5 seconds
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (commentData) => {
      const response = await axios.post(
        API_ENDPOINTS.COMMENTS_BY_PRODUCT(productId),
        commentData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", productId]);
      setShowForm(false);
      setReplyingTo(null);
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      alert("Error adding comment. Please try again.");
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, data }) => {
      const response = await axios.put(
        API_ENDPOINTS.COMMENT_BY_ID(commentId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", productId]);
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
        data: { userId: currentUserId, isAdmin },
      });
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", productId]);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment. Please try again.");
    },
  });

  // Handle form submission
  const handleSubmit = (commentData) => {
    // Prevent duplicate submissions
    if (addCommentMutation.isPending) {
      return;
    }

    // Check if this is an edit operation
    if (commentData._id) {
      // This is an edit operation
      updateCommentMutation.mutate({
        commentId: commentData._id,
        data: {
          content: commentData.content,
          userId: commentData.userId,
          isAdmin,
        },
      });
    } else {
      // This is a new comment
      if (replyingTo) {
        addCommentMutation.mutate({
          ...commentData,
          parentCommentId: replyingTo,
          userId: currentUserId,
          isAdmin,
        });
      } else {
        addCommentMutation.mutate({
          ...commentData,
          userId: currentUserId,
          isAdmin,
        });
      }
    }
  };

  // Handle comment update
  const handleUpdate = (updatedComment) => {
    updateCommentMutation.mutate({
      commentId: updatedComment._id,
      data: {
        content: updatedComment.content,
        userId: updatedComment.userId,
        isAdmin,
      },
    });
  };

  // Handle comment deletion
  const handleDelete = (commentId) => {
    deleteCommentMutation.mutate(commentId);
  };

  // Handle reply
  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setShowForm(true);
  };

  // Handle form cancel
  const handleCancel = () => {
    setShowForm(false);
    setReplyingTo(null);
  };

  // Animate new comments
  useEffect(() => {
    if (comments.length > 0 && containerRef.current) {
      const lastComment = containerRef.current.lastElementChild;
      if (lastComment) {
        gsap.fromTo(
          lastComment,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [comments]);

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
          <h3 className="text-xl font-semibold text-slate-800">
            Comments ({comments.length})
          </h3>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <FaPlus className="text-sm" />
          <span>Add Comment</span>
        </button>
      </div>

      {/* Comment Form */}
      {showForm && (
        <CommentForm
          productId={productId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          parentCommentId={replyingTo}
          isAdmin={isAdmin}
        />
      )}

      {/* Comments List */}
      <div ref={containerRef} className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="animate-spin text-orange-500 text-xl" />
            <span className="ml-2 text-slate-600">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <FaComment className="text-slate-300 text-4xl mx-auto mb-4" />
            <p className="text-slate-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={`${comment._id}-${comment.createdAt}`}
              comment={comment}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onReply={handleReply}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>

      {/* Loading states for mutations */}
      {(addCommentMutation.isPending ||
        updateCommentMutation.isPending ||
        deleteCommentMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <FaSpinner className="animate-spin" />
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSystem;
