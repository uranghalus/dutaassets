"use client";

import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { useParams } from "next/navigation";
import { useTeam } from "@/hooks/use-teams";
import { MembersTable } from "./components/members-table";
import MembersDialogs from "./components/members-dialog";
import MembersPrimaryButton from "./components/members-primary-buttons";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TeamMembersPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { data: team, isLoading } = useTeam(teamId);

  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/teams">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h2 className="text-2xl font-bold tracking-tight">
                Team Members
              </h2>
            </div>
            <p className="text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `Manage members for ${team?.name || "Team"}`}
            </p>
          </div>
          <MembersPrimaryButton />
        </div>
        <MembersTable />
      </Main>
      <MembersDialogs />
    </DialogProvider>
  );
}
