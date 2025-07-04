import React, { useState, useEffect } from "react";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTags, useGolfCourses } from "@/hooks/useApi";
import { tagsApi } from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  Tag as TagIcon,
  Download,
  Eye,
  MapPin,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const printTagsSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
  golf_course: z.string().min(1, "Golf course is required"),
});

const TagsPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { tags, loading, error, refreshTags } = useTags();
  const { golfCourses, fetchGolfCourses } = useGolfCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [golfCourseSearch, setGolfCourseSearch] = useState("");
  const [showGolfCourseDropdown, setShowGolfCourseDropdown] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGolfCourse, setSelectedGolfCourse] = useState(null);
  const [showGolfCourseModal, setShowGolfCourseModal] = useState(false);

  const form = useForm({
    resolver: zodResolver(printTagsSchema),
    defaultValues: {
      quantity: 1,
      golf_course: "",
    },
  });

  // Load golf courses when dialog opens
  useEffect(() => {
    if (showPrintDialog) {
      fetchGolfCourses({
        page: 1,
        limit: 10,
      });
    }
  }, [showPrintDialog, fetchGolfCourses]);

  const handleDeleteTag = async (tagId) => {
    try {
      await deleteTag(tagId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handlePrintTags = async (values) => {
    setPrintLoading(true);
    try {
      const response = await tagsApi.printTags(values);
      setDownloadUrl(response.file_url);
      refreshTags(); // Refresh the tags table
    } catch (error) {
      console.error("Error printing tags:", error);
      toast({
        title: "Error",
        description: "Failed to print tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPrintLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  const handleDialogClose = (open) => {
    setShowPrintDialog(open);
    if (!open) {
      // Reset form and state when dialog closes
      form.reset();
      setDownloadUrl(null);
      setPrintLoading(false);
      setGolfCourseSearch("");
      setShowGolfCourseDropdown(false);
    }
  };

  const handleGolfCourseSearch = async (searchTerm) => {
    setGolfCourseSearch(searchTerm);
    setShowGolfCourseDropdown(true);
    await fetchGolfCourses({
      page: 1,
      limit: 10,
      search: searchTerm,
    });
  };

  const handleGolfCourseInputFocus = () => {
    setShowGolfCourseDropdown(true);
    if (golfCourses.length === 0) {
      fetchGolfCourses({
        page: 1,
        limit: 10,
      });
    }
  };

  const selectGolfCourse = (course) => {
    const courseId = course.id?.id?.String || course.id || course.name;
    form.setValue("golf_course", courseId.toString());
    setGolfCourseSearch(course.name);
    setShowGolfCourseDropdown(false);
  };

  const filteredGolfCourses = golfCourses.filter((course) =>
    course.name.toLowerCase().includes(golfCourseSearch.toLowerCase()),
  );

  const filteredTags = (tags || []).filter((tag) => {
    const matchesSearch =
      tag.tag_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.owner_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.owner_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.batch?.golf_course?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || tag.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    if (status === "registered") {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    if (status === "unregistered") {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
    if (status === "lost") {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
    if (status === "found") {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  const handleViewDetails = (tag) => {
    setSelectedTag(tag);
    setShowDetailModal(true);
  };

  const handleGolfCourseClick = (golfCourse) => {
    setSelectedGolfCourse(golfCourse);
    setShowGolfCourseModal(true);
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

  const getBatchId = (batch) => {
    return batch?.id?.id?.String || "N/A";
  };

  const getGolfCourseId = (golfCourse) => {
    return golfCourse?.id?.id?.String || "N/A";
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
              <h1 className="text-2xl font-bold text-gray-900">Tags Management</h1>
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
                  placeholder="Search tags..."
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
                  <option value="registered">Registered</option>
                  <option value="unregistered">Unregistered</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
            </div>
            <Button className="flex items-center gap-2" onClick={() => setShowPrintDialog(true)}>
              <Plus className="h-4 w-4" />
              Add New Tag
            </Button>
          </div>

          {/* Tags List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                Tags ({filteredTags.length})
              </CardTitle>
              <CardDescription>Manage tags for the club house system</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <TagIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tags</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <Button onClick={refreshTags} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : filteredTags.length === 0 ? (
                <div className="text-center py-8">
                  <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Get started by creating your first tag."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag ID</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Golf Course</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTags.map((tag) => (
                      <TableRow key={tag.tag_id}>
                        <TableCell className="font-mono text-sm font-medium">
                          {tag.tag_id}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div>
                            <div className="font-medium text-sm">
                              {tag.owner_info
                                ? `${tag.owner_info.name} ${tag.owner_info.surname}`
                                : "-"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {tag.owner_info?.email || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {tag.batch?.golf_course?.name ? (
                              <button
                                className="text-blue-600 hover:text-blue-800 border-b border-dashed border-blue-400 hover:border-blue-600 text-sm"
                                onClick={() => handleGolfCourseClick(tag.batch.golf_course)}
                              >
                                {tag.batch.golf_course.name}
                              </button>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-xs text-gray-600">
                            {getBatchId(tag.batch)}
                          </div>
                          <div className="text-xs text-gray-500">{tag.batch?.total_tags} tags</div>
                        </TableCell>
                        <TableCell>
                          <span className={getStatusBadge(tag.status)}>{tag.status}</span>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{formatTimestamp(tag.created)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleViewDetails(tag)}
                              title="View Details"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleDeleteTag(tag.tag_id)}
                            >
                              <Trash2 className="h-3 w-3" />
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

      {/* Print Tags Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Print New Tags</DialogTitle>
            <DialogDescription>
              {!downloadUrl
                ? "How many tags do you want to print?"
                : "Your tags are ready for download."}
            </DialogDescription>
          </DialogHeader>

          {!downloadUrl ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePrintTags)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          disabled={printLoading}
                        />
                      </FormControl>
                      <FormDescription>Enter the number of tags to print (1-100)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="golf_course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Golf Course (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Search golf courses..."
                            value={golfCourseSearch}
                            onChange={(e) => handleGolfCourseSearch(e.target.value)}
                            onFocus={handleGolfCourseInputFocus}
                            disabled={printLoading}
                          />
                          {showGolfCourseDropdown && filteredGolfCourses.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {filteredGolfCourses.map((course) => (
                                <div
                                  key={course.id?.id?.String || course.id || course.name}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => selectGolfCourse(course)}
                                >
                                  <div className="font-medium">{course.name}</div>
                                  {course.location && (
                                    <div className="text-sm text-gray-600">{course.location}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select a golf course to associate with the tags (required)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={printLoading}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={printLoading} className="flex items-center gap-2">
                    {printLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Printing...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Print {form.watch("quantity")} Tags
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-green-600 font-medium mb-2">✓ Tags printed successfully!</p>
                <p className="text-sm text-gray-600">Your tags are ready for download.</p>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tag Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tag Details</DialogTitle>
            <DialogDescription>
              Complete information for tag {selectedTag?.tag_id}
            </DialogDescription>
          </DialogHeader>
          {selectedTag && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag ID</label>
                  <p className="font-mono text-sm">{selectedTag.tag_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={getStatusBadge(selectedTag.status)}>{selectedTag.status}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm">{formatTimestamp(selectedTag.created)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
                  <p className="font-mono text-sm">{getBatchId(selectedTag.batch)}</p>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Information
                </label>
                {selectedTag.owner_info ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <p className="text-sm">
                          {selectedTag.owner_info.name} {selectedTag.owner_info.surname}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        <p className="text-sm">{selectedTag.owner_info.email}</p>
                      </div>
                      {selectedTag.owner_info.phone && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Phone
                          </label>
                          <p className="text-sm">{selectedTag.owner_info.phone}</p>
                        </div>
                      )}
                      {selectedTag.owner_info.address && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Address
                          </label>
                          <p className="text-sm">{selectedTag.owner_info.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      No owner information - tag is unregistered
                    </p>
                  </div>
                )}
              </div>

              {/* Batch Information */}
              {selectedTag.batch && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Information
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Batch ID
                        </label>
                        <p className="font-mono text-sm">{getBatchId(selectedTag.batch)}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Total Tags
                        </label>
                        <p className="text-sm">{selectedTag.batch.total_tags}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Created
                        </label>
                        <p className="text-sm">{formatTimestamp(selectedTag.batch.created)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Golf Course Information */}
              {selectedTag.batch?.golf_course && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Golf Course
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Course Name
                        </label>
                        <p className="text-sm font-medium">{selectedTag.batch.golf_course.name}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Course ID
                        </label>
                        <p className="font-mono text-sm">
                          {getGolfCourseId(selectedTag.batch.golf_course)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Points of Interest
                        </label>
                        <p className="text-sm">
                          {selectedTag.batch.golf_course.points_of_interest?.length || 0} POIs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Form Fields */}
              {selectedTag.registration_form && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Form
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {selectedTag.registration_form.fields.map((field) => (
                        <span
                          key={field}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Golf Course Detail Modal */}
      <Dialog open={showGolfCourseModal} onOpenChange={setShowGolfCourseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Golf Course Details</DialogTitle>
            <DialogDescription>Information about the golf course</DialogDescription>
          </DialogHeader>
          {selectedGolfCourse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <p className="text-sm font-medium">{selectedGolfCourse.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                  <p className="font-mono text-sm">{getGolfCourseId(selectedGolfCourse)}</p>
                </div>
              </div>

              {selectedGolfCourse.points_of_interest &&
                selectedGolfCourse.points_of_interest.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points of Interest
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                      <div className="space-y-2">
                        {selectedGolfCourse.points_of_interest.map((poi, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span className="text-sm">{poi.label}</span>
                            <span className="text-xs text-gray-500">({poi.type})</span>
                          </div>
                        ))}
                      </div>
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

export default TagsPage;
