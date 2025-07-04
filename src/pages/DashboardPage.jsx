import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings, Tag, Users, BarChart3, FileText, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useApi } from "@/hooks/useApi";

const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isConnected, error } = useApi();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Club House Tags Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">Welcome, {user?.name || user?.email}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tags Management Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tags Management</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage Tags</div>
                <CardDescription className="mt-2">
                  Create, edit, and organize tags for the club house system
                </CardDescription>
                <div className="mt-4">
                  <Link to="/tags">
                    <Button className="w-full">Go to Tags</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evidence Records</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Evidence</div>
                <CardDescription className="mt-2">
                  View and manage digital evidence records
                </CardDescription>
                <div className="mt-4">
                  <Link to="/evidence">
                    <Button className="w-full">Go to Evidence</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Golf Courses Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Golf Courses</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Golf Courses</div>
                <CardDescription className="mt-2">
                  Browse and manage golf course information
                </CardDescription>
                <div className="mt-4">
                  <Link to="/golf-courses">
                    <Button className="w-full">View Courses</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Card */}

            {/* Analytics Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Reports</div>
                <CardDescription className="mt-2">
                  View system usage and performance metrics
                </CardDescription>
                <div className="mt-4">
                  <Button className="w-full" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Settings</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">System Settings</div>
                <CardDescription className="mt-2">
                  Configure system preferences and options
                </CardDescription>
                <div className="mt-4">
                  <Button className="w-full" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="hover:shadow-lg transition-shadow md:col-span-2">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Status</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isConnected ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auth Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                  </div>
                  {error && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Error</span>
                      <span className="text-xs text-red-600 truncate max-w-48">{error}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Role</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
