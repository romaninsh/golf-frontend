import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useEvidence } from "@/hooks/useApi";
import {
  Search,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  FileText,
  MapPin,
  Clock,
  RefreshCw,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const EvidencePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { evidence, loading, error, refreshEvidence, getEvidence } = useEvidence();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGolfCourse, setSelectedGolfCourse] = useState(null);
  const [showGolfCourseModal, setShowGolfCourseModal] = useState(false);

  const filteredEvidence = (evidence || []).filter((record) => {
    const matchesSearch =
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.golf_course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "created":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "prize_claimed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "files_verified":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLocation = (location) => {
    if (!location) return "N/A";
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  };

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [...new Set(evidence.map((record) => record.status))];

  const handleViewDetails = async (recordId) => {
    try {
      const detailData = await getEvidence(recordId);
      setSelectedEvidence(detailData);
      setShowDetailModal(true);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleOpenViewer = (recordId) => {
    const viewerUrl = `https://hole-in-one-appdesign.s3.eu-west-1.amazonaws.com/index.html?evidenceId=${recordId}`;
    window.open(viewerUrl, "_blank");
  };

  const handleGolfCourseClick = (golfCourse) => {
    setSelectedGolfCourse(golfCourse);
    setShowGolfCourseModal(true);
  };

  const handleLocationClick = (location) => {
    if (location && location.latitude && location.longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(mapsUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Evidence Records</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">{user?.name || user?.email}</div>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Actions Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search evidence records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="created">Created</option>
                  <option value="prize_claimed">Prize Claimed</option>
                  <option value="files_verified">Files Verified</option>
                </select>
              </div>
            </div>
            <Button variant="outline" onClick={refreshEvidence} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Evidence List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Evidence Records ({filteredEvidence.length})
              </CardTitle>
              <CardDescription>
                Digital evidence records from the golf course system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading evidence</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <Button onClick={refreshEvidence} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : filteredEvidence.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No evidence records found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "No evidence records have been created yet."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">ID</TableHead>
                      <TableHead className="text-sm">Golf Course</TableHead>
                      <TableHead className="text-sm">Player</TableHead>
                      <TableHead className="text-sm">Start Time</TableHead>
                      <TableHead className="text-sm">Status</TableHead>
                      <TableHead className="text-center text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvidence.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-xs">{record.id}</TableCell>
                        <TableCell>
                          <div>
                            {record.golf_course?.name ? (
                              <button
                                className="text-blue-600 hover:text-blue-800 border-b border-dashed border-blue-400 hover:border-blue-600 text-sm"
                                onClick={() => handleGolfCourseClick(record.golf_course)}
                              >
                                {record.golf_course.name}
                              </button>
                            ) : (
                              "N/A"
                            )}
                            <div className="text-xs text-gray-500 mt-0.5">
                              <button
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                onClick={() => handleLocationClick(record.location_start)}
                              >
                                <MapPin className="h-3 w-3" />
                                <span className="font-mono">
                                  {formatLocation(record.location_start)}
                                </span>
                              </button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div>
                            <div className="font-medium text-sm">
                              {record.digital_envelope?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {record.digital_envelope?.email || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                              {formatTimestamp(record.timestamp_start)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={getStatusBadge(record.status)}>{record.status}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleViewDetails(record.id)}
                              title="View Details"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleOpenViewer(record.id)}
                              title="Open Evidence Viewer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Evidence Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Evidence Details</DialogTitle>
            <DialogDescription>Complete information for evidence record</DialogDescription>
          </DialogHeader>
          {selectedEvidence && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evidence ID
                  </label>
                  <p className="font-mono text-sm">{selectedEvidence.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={getStatusBadge(selectedEvidence.status)}>
                    {selectedEvidence.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <p className="text-sm">{formatTimestamp(selectedEvidence.timestamp_start)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="font-mono text-sm">
                    {formatLocation(selectedEvidence.location_start)}
                  </p>
                </div>
              </div>

              {/* Golf Course Information */}
              {selectedEvidence.golf_course && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Golf Course
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{selectedEvidence.golf_course.name}</p>
                    {selectedEvidence.golf_course.points_of_interest && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Points of Interest:</p>
                        <ul className="text-sm text-gray-600 mt-1">
                          {selectedEvidence.golf_course.points_of_interest.map((poi, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="capitalize">{poi.type}:</span>
                              <span>{poi.label}</span>
                              <span className="font-mono text-xs">
                                ({poi.location.latitude.toFixed(6)},{" "}
                                {poi.location.longitude.toFixed(6)})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Files */}
              {selectedEvidence.files && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence Files
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedEvidence.files.video_url && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => window.open(selectedEvidence.files.video_url, "_blank")}
                      >
                        📹 Video
                      </Button>
                    )}
                    {selectedEvidence.files.picture_url && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => window.open(selectedEvidence.files.picture_url, "_blank")}
                      >
                        📸 Picture
                      </Button>
                    )}
                    {selectedEvidence.files.sensors_url && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => window.open(selectedEvidence.files.sensors_url, "_blank")}
                      >
                        📊 Sensors
                      </Button>
                    )}
                    {selectedEvidence.files.gpx_url && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => window.open(selectedEvidence.files.gpx_url, "_blank")}
                      >
                        🗺️ GPX
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Digital Envelope */}
              {selectedEvidence.digital_envelope && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Digital Envelope
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedEvidence.digital_envelope.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedEvidence.digital_envelope.email}
                      </div>
                      <div>
                        <span className="font-medium">Verified:</span>{" "}
                        {selectedEvidence.digital_envelope.verification_complete ? "Yes" : "No"}
                      </div>
                      <div>
                        <span className="font-medium">Timestamp:</span>{" "}
                        {formatTimestamp(selectedEvidence.digital_envelope.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Signature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Digital Signature
                </label>
                <p className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                  {selectedEvidence.digital_signature}
                </p>
              </div>

              {/* Claim Prize */}
              {selectedEvidence.claim_prize && selectedEvidence.claim_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prize Claim
                  </label>
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open(selectedEvidence.claim_url, "_blank")}
                  >
                    🏆 Claim Prize
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Golf Course Detail Modal */}
      <Dialog open={showGolfCourseModal} onOpenChange={setShowGolfCourseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Golf Course Details</DialogTitle>
            <DialogDescription>Information about the golf course</DialogDescription>
          </DialogHeader>
          {selectedGolfCourse && (
            <div className="space-y-4">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <p className="text-lg font-semibold">{selectedGolfCourse.name}</p>
              </div>

              {/* Course ID */}
              {selectedGolfCourse.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                  <p className="font-mono text-sm">{selectedGolfCourse.id.id?.String || "N/A"}</p>
                </div>
              )}

              {/* Points of Interest */}
              {selectedGolfCourse.points_of_interest &&
                selectedGolfCourse.points_of_interest.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points of Interest
                    </label>
                    <div className="space-y-2">
                      {selectedGolfCourse.points_of_interest.map((poi, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium capitalize">
                                {poi.type}: {poi.label}
                              </p>
                              <p className="text-sm text-gray-600 font-mono">
                                {poi.location.latitude.toFixed(6)},{" "}
                                {poi.location.longitude.toFixed(6)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLocationClick(poi.location)}
                              title="Open in Google Maps"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Course Boundary */}
              {selectedGolfCourse.boundary && selectedGolfCourse.boundary.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Boundary
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      {selectedGolfCourse.boundary[0].exterior?.length || 0} boundary points defined
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvidencePage;
