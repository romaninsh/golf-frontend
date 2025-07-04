// API utilities for localhost backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_BEARER_TOKEN = import.meta.env.VITE_API_BEARER_TOKEN || "admin-bearer-token";

// Default headers for API requests
const getDefaultHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_BEARER_TOKEN}`,
});

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: getDefaultHeaders(),
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error(`API request failed: ${config.method || "GET"} ${url}`, error);
    throw error;
  }
};

// Tags API functions
export const tagsApi = {
  // Get all tags
  getAllTags: async () => {
    const response = await apiRequest("/admin/tags", {
      method: "GET",
    });
    return response.tags || [];
  },

  // Get single tag by ID
  getTag: async (id) => {
    return await apiRequest(`/admin/tags/${id}`, {
      method: "GET",
    });
  },

  // Create new tag
  createTag: async (tagData) => {
    return await apiRequest("/admin/tags", {
      method: "POST",
      body: JSON.stringify(tagData),
    });
  },

  // Update existing tag
  updateTag: async (id, tagData) => {
    return await apiRequest(`/admin/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(tagData),
    });
  },

  // Delete tag
  deleteTag: async (id) => {
    return await apiRequest(`/admin/tags/${id}`, {
      method: "DELETE",
    });
  },

  // Print tags
  printTags: async (data) => {
    return await apiRequest("/admin/print-tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Evidence API functions
export const evidenceApi = {
  // Get all evidence records
  getAllEvidence: async () => {
    const response = await apiRequest("/evidence", {
      method: "GET",
    });
    return response.records || [];
  },

  // Get single evidence record by ID
  getEvidence: async (id) => {
    return await apiRequest(`/evidence/${id}`, {
      method: "GET",
    });
  },
};

// Golf Courses API functions
export const golfCoursesApi = {
  // Get all golf courses with pagination, sorting, and filtering
  getAllGolfCourses: async (params = {}) => {
    const { page = 1, limit = 20, sort = "name", order = "ASC", search = "" } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
    });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await apiRequest(`/admin/golf-courses?${queryParams.toString()}`, {
      method: "GET",
    });
    return response;
  },

  // Get single golf course by ID
  getGolfCourse: async (id) => {
    return await apiRequest(`/admin/golf-courses/${id}`, {
      method: "GET",
    });
  },
};

// Generic API utilities
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: getDefaultHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

// Test API connection
export const testConnection = async () => {
  try {
    const isHealthy = await healthCheck();
    if (isHealthy) {
      return { status: "connected", message: "API is healthy" };
    } else {
      return { status: "error", message: "API health check failed" };
    }
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

export default api;
