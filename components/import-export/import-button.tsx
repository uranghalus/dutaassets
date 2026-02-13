"use client";

import { Upload, FileUp } from "lucide-react";
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
import { csvToJson } from "@/lib/csv-utils";
import { toast } from "sonner";
import { useRef, useState } from "react";

interface ImportButtonProps {
  onImport: (
    data: any[],
  ) => Promise<{
    success: boolean;
    count?: number;
    error?: string;
    details?: string[];
  }>;
  title: string;
  description: string;
}

export function ImportButton({
  onImport,
  title,
  description,
}: ImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid CSV file");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result as string;
      const json = csvToJson(csv);

      if (json.length === 0) {
        toast.error("CSV file is empty");
        setIsImporting(false);
        return;
      }

      try {
        const result = await onImport(json);
        if (result.success) {
          toast.success(`Successfully imported ${result.count} records`);
          setIsOpen(false);
          setFile(null);
        } else {
          toast.error(result.error || "Import failed");
          if (result.details) {
            console.error("Import details:", result.details);
            // Optionally show detailed errors in UI
          }
        }
      } catch (error) {
        toast.error("Import failed");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Upload className="h-4 w-4" />
          <span>Import</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div
          className="mt-4 border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground font-medium">
            {file ? file.name : "Click to upload your CSV file"}
          </p>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isImporting}>
            {isImporting ? "Importing..." : "Start Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
