import { useState, useEffect, useCallback } from "react";
import { tagsApi, evidenceApi, golfCoursesApi, api, testConnection } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Custom hook for API state management
export const useApi = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testConnection();
        setIsConnected(result.status === "connected");
        if (result.status !== "connected") {
          setError(result.message);
        }
      } catch (error) {
        setIsConnected(false);
        setError(error.message);
      }
    };

    checkConnection();
  }, []);

  // Generic API request wrapper
  const makeRequest = useCallback(
    async (apiCall, options = {}) => {
      const { showToast = true, loadingState = true } = options;

      if (loadingState) setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall();

        if (showToast && options.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
          });
        }

        return result;
      } catch (error) {
        console.error("API request failed:", error);
        setError(error.message);

        if (showToast) {
          toast({
            title: "Error",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
          });
        }

        throw error;
      } finally {
        if (loadingState) setIsLoading(false);
      }
    },
    [toast],
  );

  return {
    isConnected,
    isLoading,
    error,
    makeRequest,
  };
};

// Custom hook specifically for tags management
export const useTags = () => {
  const { toast } = useToast();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tags
  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await tagsApi.getAllTags();
      setTags(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load tags",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create a new tag
  const createTag = useCallback(
    async (tagData) => {
      setLoading(true);
      setError(null);

      try {
        const newTag = await tagsApi.createTag(tagData);
        setTags((prev) => [...prev, newTag]);

        toast({
          title: "Success",
          description: "Tag created successfully",
        });

        return newTag;
      } catch (error) {
        console.error("Failed to create tag:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to create tag",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Update an existing tag
  const updateTag = useCallback(
    async (id, tagData) => {
      setLoading(true);
      setError(null);

      try {
        const updatedTag = await tagsApi.updateTag(id, tagData);
        setTags((prev) => prev.map((tag) => (tag.id === id ? updatedTag : tag)));

        toast({
          title: "Success",
          description: "Tag updated successfully",
        });

        return updatedTag;
      } catch (error) {
        console.error("Failed to update tag:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to update tag",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Delete a tag
  const deleteTag = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        await tagsApi.deleteTag(id);
        setTags((prev) => prev.filter((tag) => tag.id !== id));

        toast({
          title: "Success",
          description: "Tag deleted successfully",
        });

        return true;
      } catch (error) {
        console.error("Failed to delete tag:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to delete tag",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Get single tag by ID
  const getTag = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const tag = await tagsApi.getTag(id);
        return tag;
      } catch (error) {
        console.error("Failed to fetch tag:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load tag",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Load tags on mount
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    getTag,
    refreshTags: fetchTags,
  };
};

// Hook for general API operations
export const useApiOperations = () => {
  const { makeRequest } = useApi();

  return {
    get: useCallback(
      (endpoint, options) => makeRequest(() => api.get(endpoint), options),
      [makeRequest],
    ),

    post: useCallback(
      (endpoint, data, options) => makeRequest(() => api.post(endpoint, data), options),
      [makeRequest],
    ),

    put: useCallback(
      (endpoint, data, options) => makeRequest(() => api.put(endpoint, data), options),
      [makeRequest],
    ),

    delete: useCallback(
      (endpoint, options) => makeRequest(() => api.delete(endpoint), options),
      [makeRequest],
    ),
  };
};

// Custom hook specifically for evidence management
export const useEvidence = () => {
  const { toast } = useToast();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all evidence records
  const fetchEvidence = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await evidenceApi.getAllEvidence();
      setEvidence(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error("Failed to fetch evidence:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load evidence records",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get single evidence record by ID
  const getEvidence = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const data = await evidenceApi.getEvidence(id);
        return data;
      } catch (error) {
        console.error("Failed to fetch evidence:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load evidence record",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Load evidence on mount
  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  return {
    evidence,
    loading,
    error,
    fetchEvidence,
    getEvidence,
    refreshEvidence: fetchEvidence,
  };
};

// Custom hook specifically for golf courses management
export const useGolfCourses = () => {
  const { toast } = useToast();
  const [golfCourses, setGolfCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total_count: 0,
    total_pages: 0,
  });

  // Fetch golf courses with pagination and filtering
  const fetchGolfCourses = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await golfCoursesApi.getAllGolfCourses(params);
        setGolfCourses(Array.isArray(response.courses) ? response.courses : []);
        setPagination({
          page: response.page || 1,
          limit: response.limit || 20,
          total_count: response.total_count || 0,
          total_pages: response.total_pages || 0,
        });
        return response;
      } catch (error) {
        console.error("Failed to fetch golf courses:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load golf courses",
          variant: "destructive",
        });
        return { courses: [], total_count: 0, page: 1, limit: 20, total_pages: 0 };
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Get single golf course by ID
  const getGolfCourse = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const data = await golfCoursesApi.getGolfCourse(id);
        return data;
      } catch (error) {
        console.error("Failed to fetch golf course:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load golf course",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return {
    golfCourses,
    loading,
    error,
    pagination,
    fetchGolfCourses,
    getGolfCourse,
    refreshGolfCourses: fetchGolfCourses,
  };
};

export default useApi;
