"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HistoryToolbarProps {
  onSearch: (value: string) => void;
  searchValue: string;
}

export function HistoryToolbar({ onSearch, searchValue }: HistoryToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-3 border rounded-md bg-card">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by asset code or name..."
          className="pl-8"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
