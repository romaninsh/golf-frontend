"use client";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name");
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "Course ID",
    cell: ({ row }) => {
      const id = row.original.id;
      const displayId = id?.id?.String || "N/A";
      return <div className="font-mono text-sm text-gray-600">{displayId}</div>;
    },
  },
  {
    accessorKey: "properties",
    header: "Course Type",
    cell: ({ row }) => {
      const properties = row.getValue("properties") || {};
      const holes = properties["golf:course:holes"] || "N/A";
      const par = properties["golf:course:par"] || "N/A";

      return (
        <div className="text-sm">
          <div>{holes} holes</div>
          {par !== "N/A" && <div className="text-gray-500">Par {par}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "points_of_interest",
    header: "POIs",
    cell: ({ row }) => {
      const pois = row.getValue("points_of_interest") || [];
      return (
        <div className="text-sm text-gray-600">
          {pois.length > 0 ? `${pois.length} POI${pois.length > 1 ? "s" : ""}` : "None"}
        </div>
      );
    },
  },
  {
    accessorKey: "properties.operator",
    header: "Operator",
    cell: ({ row }) => {
      const properties = row.original.properties || {};
      const operator = properties.operator || "N/A";
      return <div className="text-sm">{operator}</div>;
    },
  },
  {
    accessorKey: "properties.website",
    header: "Website",
    cell: ({ row }) => {
      const properties = row.original.properties || {};
      const website = properties.website;

      if (website) {
        return (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Visit
          </a>
        );
      }

      return <div className="text-gray-400 text-sm">None</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const course = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                const courseId = course.id?.id?.String || course.name;
                navigator.clipboard.writeText(courseId);
              }}
            >
              Copy course ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>View on map</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
