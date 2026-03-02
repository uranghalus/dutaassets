"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type MemberProps = {
  id: string;
  role: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type OrganizationMembersTableProps = {
  organizationId: string;
  members: MemberProps[];
};

export function OrganizationMembersTable({
  members,
}: OrganizationMembersTableProps) {
  if (!members || members.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground w-full rounded-md border mt-4">
        No members found.
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.user?.name || "Unknown"}
              </TableCell>
              <TableCell>{member.user?.email || "Unknown"}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {member.role || "member"}
                </Badge>
              </TableCell>
              <TableCell>
                {member.createdAt
                  ? new Date(member.createdAt).toLocaleDateString()
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
