"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import { ImportButton } from "@/components/import-export/import-button";
import { ExportButton } from "@/components/import-export/export-button";
import { importItems, getItemsForExport } from "@/action/item-action";
import { useSearchParams } from "next/navigation";

export default function ItemPrimaryButtons() {
  const { setOpen } = useDialog();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const itemHeaders = [
    { label: "Item Code", key: "code" },
    { label: "Item Name", key: "name" },
    { label: "Unit", key: "unit" },
    { label: "Category", key: "itemCategory.name" },
    { label: "Min Stock", key: "minStock" },
    { label: "Description", key: "description" },
  ];

  return (
    <div className="flex gap-2">
      <ExportButton
        fileName="items_export"
        headers={itemHeaders}
        onExportCurrentPage={() => getItemsForExport({ search, categoryId })}
        onExportAll={() => getItemsForExport({ search, categoryId })}
      />
      <ImportButton
        title="Import Items"
        description="Upload a CSV file to batch create master items."
        onImport={importItems as any}
      />
      <Button onClick={() => setOpen("add")} className="space-x-1">
        <span>Add Item</span> <Plus size={18} />
      </Button>
    </div>
  );
}
