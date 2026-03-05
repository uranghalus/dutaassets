"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import { Plus } from "lucide-react";
import { ImportButton } from "@/components/import-export/import-button";
import { ExportButton } from "@/components/import-export/export-button";
import {
  importEmployees,
  getEmployeesForExport,
} from "@/action/employees-action";

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

export default function EmployeesPrimaryButton() {
  const { setOpen } = useDialog();

  return (
    <div className="flex gap-2">
      <ExportButton
        fileName="employees_export"
        headers={employeeHeaders}
        onExportCurrentPage={() => getEmployeesForExport()}
        onExportAll={() => getEmployeesForExport()}
      />
      <ImportButton
        title="Import Karyawan"
        description="Upload file CSV untuk menambahkan data karyawan secara massal. Pastikan kolom Divisi dan Department sesuai dengan data yang ada di sistem."
        onImport={importEmployees as any}
        templateHeaders={employeeHeaders}
      />
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Tambah Data</span> <Plus size={18} />
      </Button>
    </div>
  );
}
