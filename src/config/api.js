// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,

  // Admin
  ADMIN_UPLOAD: `${API_BASE_URL}/api/admin/admin-upload`,
  ADMIN_IMAGE_UPLOAD: `${API_BASE_URL}/api/admin/upload-image`,

  // Comments
  COMMENTS_BY_PRODUCT: (productId) =>
    `${API_BASE_URL}/api/comments/${productId}`,
  COMMENT_BY_ID: (commentId) => `${API_BASE_URL}/api/comments/${commentId}`,
  ADMIN_ALL_COMMENTS: `${API_BASE_URL}/api/comments/admin/all`,
};

export default API_BASE_URL;
