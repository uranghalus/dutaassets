"use client";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberRowActions } from "./members-row-action";

// Better Auth Team Member Type (approximate)
export type TeamMember = {
  id: string; // relationship id usually
  role: string;
  userId: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export const memberColumns: ColumnDef<TeamMember>[] = [
  /* =====================
     * SELECT
     ===================== */
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10,
  },

  /* =====================
     * USER INFO (Avatar + Name + Email)
     ===================== */
  {
    id: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    accessorFn: (row) => row.user.name,
    cell: ({ row }) => {
      const user = row.original.user || {
        name: "Unknown",
        email: "",
        image: null,
      };
      return (
        <div className="flex items-center gap-2 ps-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
    size: 250,
  },

  /* =====================
     * ROLE
     ===================== */
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ cell }) => (
      <div className="font-medium ps-2 capitalize">
        {cell.getValue() as string}
      </div>
    ),
    size: 100,
  },

  /* =====================
     * JOINED AT
     ===================== */
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined At" />
    ),
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
    size: 140,
  },

  /* =====================
     * ACTIONS
     ===================== */
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aksi" className="ml-auto" />
    ),
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    cell: MemberRowActions,
    meta: {
      className: cn(
        "sticky right-0 z-10 w-[60px] px-2",
        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200",
      ),
    },
  },
];
