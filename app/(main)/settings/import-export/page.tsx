"use client";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImportButton } from "@/components/import-export/import-button";
import { ExportButton } from "@/components/import-export/export-button";
import { importAssets, getAssetsForExport } from "@/action/asset-action";
import {
  importEmployees,
  getEmployeesForExport,
} from "@/action/employees-action";
import { importItems, getItemsForExport } from "@/action/item-action";
import {
  Package,
  Users,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  Info,
} from "lucide-react";

// ── Module configs ────────────────────────────────────────────────────────────
const assetHeaders = [
  { label: "Asset Code", key: "kode_asset" },
  { label: "Asset Name", key: "nama_asset" },
  { label: "Category", key: "assetCategory.name" },
  { label: "Department", key: "department_fk.nama" },
  { label: "Division", key: "divisi_fk.nama" },
  { label: "Employee", key: "karyawan_fk.nama" },
  { label: "Status", key: "status" },
  { label: "Condition", key: "kondisi" },
  { label: "Brand", key: "brand" },
  { label: "Model", key: "model" },
  { label: "Serial Number", key: "serial_number" },
  { label: "Location", key: "lokasi" },
  { label: "Purchase Date", key: "tgl_pembelian" },
  { label: "Price", key: "harga" },
];

const employeeHeaders = [
  { label: "NIK", key: "nik" },
  { label: "Nama", key: "nama" },
  { label: "Nama Alias", key: "nama_alias" },
  { label: "Jabatan", key: "jabatan" },
  { label: "Status Karyawan", key: "status_karyawan" },
  { label: "Telepon", key: "telp" },
  { label: "Tempat Lahir", key: "tempat_lahir" },
  { label: "Tgl Lahir", key: "tgl_lahir" },
  { label: "Tgl Masuk", key: "tgl_masuk" },
  { label: "Department", key: "department" },
  { label: "Divisi", key: "divisi" },
  { label: "Alamat", key: "alamat" },
  { label: "No KTP", key: "no_ktp" },
  { label: "Call Sign", key: "call_sign" },
  { label: "Keterangan", key: "keterangan" },
];

const itemHeaders = [
  { label: "Item Code", key: "code" },
  { label: "Item Name", key: "name" },
  { label: "Unit", key: "unit" },
  { label: "Category", key: "itemCategory.name" },
  { label: "Min Stock", key: "minStock" },
  { label: "Description", key: "description" },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold leading-none">{title}</p>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ModuleCard({
  icon,
  title,
  description,
  badge,
  importConfig,
  exportConfig,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  importConfig: {
    title: string;
    description: string;
    onImport: (data: any[]) => Promise<any>;
    templateHeaders: { label: string; key: string }[];
  };
  exportConfig: {
    fileName: string;
    headers: { label: string; key: string }[];
    onExportAll: () => Promise<any[]>;
    onExportCurrentPage: () => any[] | Promise<any[]>;
  };
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            icon={icon}
            title={title}
            description={description}
            badge={badge}
          />
          <div className="flex items-center gap-2 shrink-0">
            <ExportButton
              fileName={exportConfig.fileName}
              headers={exportConfig.headers}
              onExportAll={exportConfig.onExportAll}
              onExportCurrentPage={exportConfig.onExportCurrentPage}
            />
            <ImportButton
              title={importConfig.title}
              description={importConfig.description}
              onImport={importConfig.onImport}
              templateHeaders={importConfig.templateHeaders}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md bg-muted/40 border px-3 py-2 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Download the <span className="font-medium">Template</span> inside
            the Import dialog to see the expected CSV column format.
            {title === "Data Karyawan" && (
              <>
                {" "}
                Columns <span className="font-medium">Divisi</span> and{" "}
                <span className="font-medium">Department</span> must match names
                already registered in the system.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ImportExportPage() {
  return (
    <div className="flex flex-col gap-6 flex-1 w-full max-w-2xl px-2 pb-12">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Import &amp; Export</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kelola data massal dengan mengimpor atau mengekspor file CSV untuk
          setiap modul.
        </p>
      </div>

      <Separator />

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 p-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900">
          <ArrowDownToLine className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Cara penggunaan
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5 list-disc list-inside">
            <li>
              <span className="font-medium">Export</span> — download data yang
              sudah ada ke file CSV
            </li>
            <li>
              <span className="font-medium">Import</span> — upload file CSV
              untuk menambahkan data secara massal
            </li>
            <li>
              Gunakan tombol <span className="font-medium">Template</span> di
              dialog Import untuk mendapatkan format kolom yang benar
            </li>
          </ul>
        </div>
      </div>

      {/* ── Fixed Assets ──────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ArrowUpFromLine className="h-3.5 w-3.5 text-muted-foreground" />
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Asset Management
          </h4>
        </div>
        <ModuleCard
          icon={Package}
          title="Fixed Assets"
          description="Aset tetap organisasi (peralatan, kendaraan, inventaris)"
          importConfig={{
            title: "Import Assets",
            description: "Upload file CSV untuk batch create fixed assets.",
            onImport: importAssets as any,
            templateHeaders: assetHeaders,
          }}
          exportConfig={{
            fileName: "assets_export",
            headers: assetHeaders,
            onExportAll: () => getAssetsForExport({}),
            onExportCurrentPage: () => getAssetsForExport({}),
          }}
        />
      </section>

      <Separator />

      {/* ── HR / Employees ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ArrowUpFromLine className="h-3.5 w-3.5 text-muted-foreground" />
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Organisasi &amp; SDM
          </h4>
        </div>
        <ModuleCard
          icon={Users}
          title="Data Karyawan"
          description="Data karyawan termasuk divisi, department, dan jabatan"
          importConfig={{
            title: "Import Karyawan",
            description:
              "Upload file CSV untuk menambahkan karyawan secara massal. Kolom Divisi dan Department harus sesuai nama yang ada di sistem.",
            onImport: importEmployees as any,
            templateHeaders: employeeHeaders,
          }}
          exportConfig={{
            fileName: "employees_export",
            headers: employeeHeaders,
            onExportAll: () => getEmployeesForExport(),
            onExportCurrentPage: () => getEmployeesForExport(),
          }}
        />
      </section>

      <Separator />

      {/* ── Inventory ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ArrowUpFromLine className="h-3.5 w-3.5 text-muted-foreground" />
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Inventory Control
          </h4>
        </div>
        <ModuleCard
          icon={Boxes}
          title="Master Item"
          description="Data master barang / item inventaris"
          importConfig={{
            title: "Import Items",
            description: "Upload file CSV untuk batch create master items.",
            onImport: importItems as any,
            templateHeaders: itemHeaders,
          }}
          exportConfig={{
            fileName: "items_export",
            headers: itemHeaders,
            onExportAll: () => getItemsForExport({}),
            onExportCurrentPage: () => getItemsForExport({}),
          }}
        />
      </section>
    </div>
  );
}
