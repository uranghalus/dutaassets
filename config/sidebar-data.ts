import {
  LayoutDashboard,
  Package,
  Boxes,
  Tags,
  MapPin,
  Handshake,
  Wrench,
  Move,
  History,
  ShieldCheck,
  FileText,
  Users,
  UserCog,
  Building,
  Layers,
  Briefcase,
  Key,
  UserCircle,
  Sliders,
  Upload,
  Building2,
  ClipboardList,
  Truck,
  Warehouse,
  ArrowDownUp,
} from "lucide-react";

import { SidebarData } from "@/types";

/**
 * Pemetaan role sidebar:
 *
 * GLOBAL (semua role):            tidak perlu `roles` field
 * Admin-only:                     roles: ['owner', 'admin']
 * Asset staff (global scope):     roles: ['owner', 'admin', 'finance_manager', 'staff_asset']
 * Semua jabatan operasional:      roles: ['owner', 'admin', 'manager', 'supervisor', 'staff_lapangan', 'staff_administrasi', 'finance_manager', 'staff_asset']
 */

/** Semua jabatan — digunakan untuk item yang visible ke semua role */
const ALL_ROLES = [
  "owner",
  "admin",
  "member",
  "manager",
  "supervisor",
  "staff_lapangan",
  "staff_administrasi",
  "finance_manager",
  "staff_asset",
] as const;

/** Hanya owner & admin (system admin) */
const ADMIN_ROLES = ["owner", "admin"] satisfies string[];

/** finance_manager + staff_asset + admin/owner (global-scope roles) */
const GLOBAL_ASSET_ROLES = [
  "owner",
  "admin",
  "finance_manager",
  "staff_asset",
] satisfies string[];

/** Role yang bisa mengelola aset (buat, ubah, dst) — semua kecuali finance_manager */
const ASSET_MANAGER_ROLES = [
  "owner",
  "admin",
  "manager",
  "supervisor",
  "staff_lapangan",
  "staff_administrasi",
  "staff_asset",
] satisfies string[];

/** Semua role yang bisa melihat aset (semua jabatan) */
const ASSET_VIEWER_ROLES = [...ALL_ROLES] satisfies string[];

export const sidebarData: SidebarData = {
  // ======================
  // APP INFO
  // ======================
  teams: [
    {
      name: "DutaAsset",
      logo: Package,
      plan: "v1.0.0",
    },
  ],

  // ======================
  // NAVIGATION
  // ======================
  navGroups: [
    // ---------- GENERAL ----------
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          // Dashboard visible semua role
        },
        {
          title: "Tambah Aset",
          url: "/assets/create",
          icon: Package,
          // Hanya role yang bisa create aset (bukan finance_manager)
          roles: ASSET_MANAGER_ROLES,
        },
      ],
    },

    // ---------- ASSET MANAGEMENT ----------
    {
      title: "Asset Management",
      // Seluruh group visible untuk semua role yang ada hubungannya dengan aset
      roles: ASSET_VIEWER_ROLES,
      items: [
        {
          title: "Daftar Aset",
          url: "/assets",
          icon: Boxes,
          // Semua role bisa lihat daftar aset
        },
        {
          title: "Kategori Aset",
          url: "/assets/categories",
          icon: Tags,
          // Hanya admin/owner/staff_asset yang manage kategori
          roles: GLOBAL_ASSET_ROLES,
        },
        {
          title: "Lokasi Aset",
          url: "/asset-locations",
          icon: MapPin,
          // Hanya admin/owner/staff_asset yang manage lokasi
          roles: GLOBAL_ASSET_ROLES,
        },
        {
          title: "Peminjaman Aset",
          url: "/asset-loans",
          icon: Handshake,
          // Semua yang bisa interact dengan aset
          roles: ASSET_VIEWER_ROLES,
        },
        {
          title: "Maintenance Aset",
          url: "/assets/maintenances",
          icon: Wrench,
          roles: ASSET_VIEWER_ROLES,
        },
        {
          title: "Mutasi Aset",
          url: "/asset-transfers",
          icon: Move,
          roles: ASSET_VIEWER_ROLES,
        },
        {
          title: "Riwayat Aset",
          url: "/asset-history",
          icon: History,
          roles: ASSET_VIEWER_ROLES,
        },
      ],
    },

    // ---------- INVENTORY CONTROL ----------
    {
      title: "Inventory Control",
      // Inventory hanya untuk admin, owner, dan staff_administrasi
      roles: ["owner", "admin", "staff_administrasi", "staff_asset"],
      items: [
        {
          title: "Master Item",
          url: "/inventory/items",
          icon: Package,
        },
        {
          title: "Kategori Item",
          url: "/inventory/categories",
          icon: Tags,
        },
        {
          title: "Gudang",
          url: "/inventory/warehouses",
          icon: Warehouse,
        },
        {
          title: "Requisition",
          icon: ClipboardList,
          items: [
            {
              title: "Permintaan Barang",
              url: "/inventory/requisitions",
            },
            {
              title: "Persetujuan Permintaan",
              url: "/inventory/requisition/approval",
            },
          ],
        },
        {
          title: "Penerimaan Barang",
          url: "/inventory/receipts",
          icon: Truck,
        },
        {
          title: "Penyesuaian Stok",
          url: "/inventory/adjustments",
          icon: ArrowDownUp,
        },
        {
          title: "Mutasi Stok",
          url: "/inventory/transfers",
          icon: Move,
        },
        {
          title: "Stok Barang",
          url: "/inventory/stocks",
          icon: Boxes,
        },
      ],
    },

    // ---------- AUDIT & LAPORAN ----------
    {
      title: "Audit & Laporan",
      roles: [...GLOBAL_ASSET_ROLES, "manager", "supervisor"],
      items: [
        {
          title: "Log Audit",
          url: "/audit-logs",
          icon: ShieldCheck,
          // Hanya admin/owner
          roles: ADMIN_ROLES,
        },
        {
          title: "Laporan",
          url: "/reports",
          icon: FileText,
          // Manager ke atas bisa lihat laporan
          roles: [...GLOBAL_ASSET_ROLES, "manager", "supervisor"],
        },
      ],
    },

    // ---------- ORGANISASI & SDM ----------
    {
      title: "Organisasi & SDM",
      // Hanya admin/owner yang manage org & SDM
      roles: ADMIN_ROLES,
      items: [
        {
          title: "Unit Bisnis",
          url: "/organizations",
          icon: Building2,
        },
        {
          title: "Pengguna",
          url: "/users",
          icon: UserCog,
        },
        {
          title: "Karyawan",
          url: "/employees",
          icon: Briefcase,
        },
        {
          title: "Department",
          url: "/departments",
          icon: Layers,
        },
        {
          title: "Divisi",
          url: "/divisions",
          icon: Building,
        },
        {
          title: "Teams",
          icon: Users,
          items: [
            {
              title: "Team List",
              url: "/teams",
            },
            {
              title: "Team Members",
              url: "/teams/members",
            },
            {
              title: "Permissions",
              url: "/teams/permissions",
            },
          ],
        },
        {
          title: "Role & Permission",
          url: "/roles",
          icon: Key,
        },
      ],
    },

    // ---------- SETTINGS ----------
    {
      title: "Settings",
      // Settings visible untuk semua role
      items: [
        {
          title: "Profil Saya",
          url: "/settings/profile",
          icon: UserCircle,
        },
        {
          title: "Preferensi",
          url: "/settings/preferences",
          icon: Sliders,
        },
        {
          title: "Import / Export",
          url: "/settings/import-export",
          icon: Upload,
          // Hanya role yang punya izin import/export
          roles: [...GLOBAL_ASSET_ROLES, "staff_administrasi"],
        },
      ],
    },
  ],
};
