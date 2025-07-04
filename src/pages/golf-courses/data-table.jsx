"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable({
  columns,
  data,
  pagination,
  onPaginationChange,
  onSortingChange,
  onSearchChange,
  onRefresh,
  loading,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      // Convert TanStack sorting format to API format
      if (newSorting.length > 0) {
        const sort = newSorting[0];
        onSortingChange?.(sort.id, sort.desc ? "DESC" : "ASC");
      } else {
        onSortingChange?.("name", "ASC"); // Default sorting
      }
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    // Disable client-side pagination since we're using server-side
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: pagination?.total_pages || 0,
  });

  const searchTimeoutRef = React.useRef(null);

  const handleSearch = React.useCallback(
    (event) => {
      const value = event.target.value;
      setSearchValue(value);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search
      searchTimeoutRef.current = setTimeout(() => {
        onSearchChange?.(value);
      }, 300);
    },
    [onSearchChange],
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handlePaginationClick = React.useCallback(
    (page) => {
      onPaginationChange?.(page);
      // Prevent scroll to top by not reloading the page
    },
    [onPaginationChange],
  );

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search golf courses..."
          value={searchValue}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="ml-auto flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No golf courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {((pagination?.page || 1) - 1) * (pagination?.limit || 20) + 1} to{" "}
          {Math.min(
            (pagination?.page || 1) * (pagination?.limit || 20),
            pagination?.total_count || 0,
          )}{" "}
          of {pagination?.total_count || 0} course(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePaginationClick(1)}
            disabled={!pagination || pagination.page <= 1}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePaginationClick(Math.max(1, (pagination?.page || 1) - 1))}
            disabled={!pagination || pagination.page <= 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm">Page</span>
            <span className="text-sm font-medium">
              {pagination?.page || 1} of {pagination?.total_pages || 1}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePaginationClick((pagination?.page || 1) + 1)}
            disabled={!pagination || pagination.page >= pagination.total_pages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePaginationClick(pagination?.total_pages || 1)}
            disabled={!pagination || pagination.page >= pagination.total_pages}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
