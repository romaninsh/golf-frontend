import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGolfCourses } from "@/hooks/useApi";
import { ArrowLeft, MapPin, RefreshCw, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "./golf-courses/data-table";
import { columns } from "./golf-courses/columns";

const GolfCoursesPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { golfCourses, loading, error, pagination, fetchGolfCourses } = useGolfCourses();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  // Load initial data
  useEffect(() => {
    fetchGolfCourses({
      page: 1,
      limit: 20,
      sort: sortField,
      order: sortOrder,
      search: searchTerm,
    });
  }, []);

  // Handle pagination changes
  const handlePaginationChange = useCallback(
    (newPage) => {
      fetchGolfCourses({
        page: newPage,
        limit: pagination.limit,
        sort: sortField,
        order: sortOrder,
        search: searchTerm,
      });
    },
    [fetchGolfCourses, pagination.limit, sortField, sortOrder, searchTerm],
  );

  // Handle sorting changes
  const handleSortingChange = useCallback(
    (field, order) => {
      setSortField(field);
      setSortOrder(order);
      fetchGolfCourses({
        page: 1, // Reset to first page when sorting
        limit: pagination.limit,
        sort: field,
        order: order,
        search: searchTerm,
      });
    },
    [fetchGolfCourses, pagination.limit, searchTerm],
  );

  // Handle search changes
  const handleSearchChange = useCallback(
    (search) => {
      setSearchTerm(search);
      fetchGolfCourses({
        page: 1, // Reset to first page when searching
        limit: pagination.limit,
        sort: sortField,
        order: sortOrder,
        search: search,
      });
    },
    [fetchGolfCourses, pagination.limit, sortField, sortOrder],
  );

  // Handle refresh
  const handleRefresh = () => {
    fetchGolfCourses({
      page: pagination.page,
      limit: pagination.limit,
      sort: sortField,
      order: sortOrder,
      search: searchTerm,
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Golf Courses</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name || user?.email}</span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
              <CardDescription>Failed to load golf courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Golf Courses</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <span className="text-sm text-gray-600">Welcome, {user?.name || user?.email}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pagination.total_count || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Page</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pagination.page || 1}</div>
                <p className="text-xs text-muted-foreground">
                  of {pagination.total_pages || 1} pages
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courses Shown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{golfCourses.length}</div>
                <p className="text-xs text-muted-foreground">per page: {pagination.limit || 20}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sort Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold capitalize">{sortField}</div>
                <p className="text-xs text-muted-foreground">{sortOrder}</p>
              </CardContent>
            </Card>
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Golf Courses</CardTitle>
              <CardDescription>
                Browse and manage golf course information
                {searchTerm && ` (filtered by "${searchTerm}")`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative min-h-[400px]">
                {loading && golfCourses.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span>Loading golf courses...</span>
                    </div>
                  </div>
                ) : (
                  <div className={loading ? "opacity-75 pointer-events-none" : ""}>
                    <DataTable
                      columns={columns}
                      data={golfCourses}
                      pagination={pagination}
                      onPaginationChange={handlePaginationChange}
                      onSortingChange={handleSortingChange}
                      onSearchChange={handleSearchChange}
                      onRefresh={handleRefresh}
                      loading={loading}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GolfCoursesPage;
