"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AssetHistoryItem } from "@/action/asset-history-action";
import {
  ArrowLeftRight,
  ClipboardList,
  Wrench,
  History,
  User,
  MapPin,
} from "lucide-react";

export const historyColumns: ColumnDef<AssetHistoryItem>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {format(new Date(row.original.date), "dd MMM yyyy")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(row.original.date), "HH:mm")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      const icons = {
        TRANSFER: <ArrowLeftRight className="h-3 w-3 mr-1" />,
        LOAN: <ClipboardList className="h-3 w-3 mr-1" />,
        MAINTENANCE: <Wrench className="h-3 w-3 mr-1" />,
        LOG: <History className="h-3 w-3 mr-1" />,
      };

      const variants = {
        TRANSFER: "outline" as const,
        LOAN: "outline" as const,
        MAINTENANCE: "outline" as const,
        LOG: "outline" as const,
      };

      return (
        <Badge variant={variants[type]} className="capitalize">
          {icons[type]}
          {type.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return <span className="font-mono text-xs">{row.original.action}</span>;
    },
  },
  {
    header: "Asset",
    cell: ({ row }) => {
      const { details } = row.original;
      return (
        <div className="flex flex-col min-w-[150px]">
          <span className="font-medium text-sm line-clamp-1">
            {details.assetName}
          </span>
          <span className="text-xs text-muted-foreground">
            {details.assetCode}
          </span>
        </div>
      );
    },
  },
  {
    header: "Details",
    cell: ({ row }) => {
      const { type, details } = row.original;

      if (type === "TRANSFER") {
        return (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">From</span>
              <span>{details.from}</span>
            </div>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">To</span>
              <span>{details.to}</span>
            </div>
          </div>
        );
      }

      if (type === "LOAN") {
        return (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{details.employee}</span>
          </div>
        );
      }

      if (type === "MAINTENANCE") {
        return (
          <div className="flex flex-col text-sm">
            <span className="font-medium">{details.type}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {details.description || "No description"}
            </span>
          </div>
        );
      }

      return (
        <div className="max-w-[400px] truncate text-sm">
          {typeof details === "string"
            ? details
            : JSON.stringify(details).substring(0, 50) + "..."}
        </div>
      );
    },
  },
  {
    header: "Performed By",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      );
    },
  },
];
