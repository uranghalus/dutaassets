"use client";

import {
  Upload,
  FileUp,
  Download,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { csvToJson, generateTemplateCsv, downloadCsv } from "@/lib/csv-utils";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ImportButtonProps {
  onImport: (data: any[]) => Promise<{
    success: boolean;
    count?: number;
    error?: string;
    details?: string[];
  }>;
  title: string;
  description: string;
  /** Column definitions used to generate the downloadable template CSV */
  templateHeaders: { label: string; key: string }[];
}

export function ImportButton({
  onImport,
  title,
  description,
  templateHeaders,
}: ImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setPreviewData([]);
    setPreviewHeaders([]);
    setImportErrors([]);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetState();
  };

  const parseAndPreview = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const json = csvToJson(csv);
      if (json.length > 0) {
        setPreviewHeaders(Object.keys(json[0]));
        setPreviewData(json.slice(0, 5));
      } else {
        setPreviewHeaders([]);
        setPreviewData([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  const processFile = (selectedFile: File) => {
    if (
      selectedFile.type === "text/csv" ||
      selectedFile.name.endsWith(".csv")
    ) {
      setFile(selectedFile);
      setImportErrors([]);
      parseAndPreview(selectedFile);
    } else {
      toast.error("Please select a valid CSV file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleDownloadTemplate = () => {
    const csv = generateTemplateCsv(templateHeaders);
    downloadCsv(
      csv,
      `template_${title.toLowerCase().replace(/\s+/g, "_")}.csv`,
    );
    toast.success("Template downloaded");
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsImporting(true);
    setImportErrors([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result as string;
      const json = csvToJson(csv);

      if (json.length === 0) {
        toast.error("CSV file is empty or has no data rows");
        setIsImporting(false);
        return;
      }

      try {
        const result = await onImport(json);
        if (result.success) {
          toast.success(`Successfully imported ${result.count} records`);
          handleOpenChange(false);
        } else {
          if (result.details && result.details.length > 0) {
            setImportErrors(result.details);
          } else {
            toast.error(result.error || "Import failed");
          }
        }
      } catch {
        toast.error("An unexpected error occurred during import");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Upload className="h-4 w-4" />
          <span>Import</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
              isDragging
                ? "border-primary bg-primary/10"
                : "hover:bg-muted/50 border-muted-foreground/30",
              file && "border-primary/50 bg-primary/5",
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileUp
              className={cn(
                "h-8 w-8 transition-colors",
                file ? "text-primary" : "text-muted-foreground",
              )}
            />
            {file ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-primary">{file.name}</p>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetState();
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-muted-foreground">
                  Drag & drop or click to upload CSV
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Only .csv files are accepted
                </p>
              </>
            )}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Template Download */}
          <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Not sure about the format?{" "}
              <span className="font-medium">
                Download the template CSV first.
              </span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs shrink-0"
              onClick={handleDownloadTemplate}
            >
              <Download className="h-3 w-3" />
              Template
            </Button>
          </div>

          {/* CSV Preview Table */}
          {previewData.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Preview{" "}
                <span className="font-normal">(showing up to 5 rows)</span>
              </p>
              <ScrollArea className="max-h-44 rounded-md border">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b bg-muted/60">
                      <tr>
                        {previewHeaders.map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b last:border-0 hover:bg-muted/30"
                        >
                          {previewHeaders.map((h) => (
                            <td
                              key={h}
                              className="px-3 py-1.5 whitespace-nowrap text-foreground/80 max-w-[160px] truncate"
                            >
                              {row[h] ?? "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Validation Errors */}
          {importErrors.length > 0 && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 space-y-2">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm font-semibold">
                  {importErrors.length} validation error
                  {importErrors.length > 1 ? "s" : ""} found
                </p>
              </div>
              <ScrollArea className="max-h-36">
                <ul className="space-y-0.5 text-xs text-destructive/90">
                  {importErrors.map((err, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="mt-px shrink-0">•</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isImporting}
            className="min-w-[110px]"
          >
            {isImporting ? (
              <>
                <span className="animate-spin mr-2 h-3 w-3 rounded-full border-2 border-current border-t-transparent" />
                Importing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Start Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
