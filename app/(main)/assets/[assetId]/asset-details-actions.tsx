"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useAssetDialog } from "../components/asset-dialog-provider";
import { Asset, Department, Divisi, Karyawan } from "@/generated/prisma/client";

type AssetWithRelations = Asset & {
  department_fk: Department;
  divisi_fk?: Divisi | null;
  karyawan_fk?: Karyawan | null;
};

export function AssetDetailsActions({ asset }: { asset: AssetWithRelations }) {
  const { setOpen, setCurrentAsset } = useAssetDialog();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setCurrentAsset(asset);
          setOpen("edit");
        }}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit Asset
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setCurrentAsset(asset);
          setOpen("delete");
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
