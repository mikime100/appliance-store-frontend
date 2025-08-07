import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import axios from "axios";

const CommentForm = ({
  productId,
  onSubmit,
  onCancel,
  editComment = null,
  parentCommentId = null,
  isAdmin = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    content: editComment ? editComment.content : "",
    userName: editComment ? editComment.userName : "",
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const submitTimeoutRef = useRef(null);

  // Generate anonymous user ID if not editing
  const [userId] = useState(() => {
    if (editComment) return editComment.userId;
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  useEffect(() => {
    // Animate form appearance
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }

    // Auto-focus textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Cleanup timeout on unmount
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    } else if (formData.userName.length > 50) {
      newErrors.userName = "Name cannot exceed 50 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Comment cannot be empty";
    } else if (formData.content.length > 1000) {
      newErrors.content = "Comment cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Form is already submitting");
      return;
    }

    // Clear any existing timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Add a small delay to prevent rapid submissions
    submitTimeoutRef.current = setTimeout(() => {
      try {
        if (editComment) {
          // For editing, pass the updated comment data
          const updatedComment = {
            _id: editComment._id,
            content: formData.content,
            userId: editComment.userId,
            isAdmin,
          };
          onSubmit(updatedComment);
        } else {
          // For new comments, prepare the comment data
          const commentData = {
            content: formData.content,
            userName: formData.userName,
            userId,
            parentCommentId,
            isAdmin,
          };
          onSubmit(commentData);
        }

        // Animate form out
        gsap.to(formRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          onComplete: () => {
            setFormData({ content: "", userName: "" });
            setErrors({});
          },
        });
      } catch (error) {
        console.error("Error in form submission:", error);
      } finally {
        setIsSubmitting(false);
      }
    }, 100); // 100ms delay
  };

  const handleCancel = () => {
    gsap.to(formRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      onComplete: () => {
        onCancel();
        setFormData({ content: "", userName: "" });
        setErrors({});
      },
    });
  };

  return (
    <div
      ref={formRef}
      className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-lg"
      style={{ borderColor: "rgba(15, 23, 42, 0.2)" }}
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {!editComment && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your name"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {editComment ? "Edit Comment" : "Your Comment"} *
          </label>
          <textarea
            ref={textareaRef}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder={
              editComment ? "Edit your comment..." : "Share your thoughts..."
            }
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? "Submitting..."
                : editComment
                ? "Update"
                : "Post Comment"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          {isAdmin && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              Admin Comment
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
