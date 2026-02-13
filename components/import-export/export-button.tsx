"use client";

import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jsonToCsv, downloadCsv } from "@/lib/csv-utils";
import { toast } from "sonner";
import { useState } from "react";

interface ExportButtonProps {
  onExportAll: () => Promise<any[]>;
  onExportCurrentPage: () => any[] | Promise<any[]>;
  headers: { label: string; key: string }[];
  fileName: string;
}

export function ExportButton({
  onExportAll,
  onExportCurrentPage,
  headers,
  fileName,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: "all" | "current") => {
    setIsExporting(true);
    try {
      const result =
        type === "all" ? await onExportAll() : onExportCurrentPage();
      const data = result instanceof Promise ? await result : result;

      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const csv = jsonToCsv(data, headers);
      downloadCsv(csv, `${fileName}_${new Date().getTime()}.csv`);
      toast.success(`Exported ${data.length} records`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("current")}>
          Current Page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("all")}>
          All Results (Filtered)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
