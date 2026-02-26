import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/organization/access";

// =============================================================================
// STATEMENT — semua resource yang ada di sistem
// Setiap resource dipetakan langsung ke menu sidebar yang bersangkutan.
// =============================================================================

export const statement = {
  ...defaultStatements,

  // ── Org Management (Sidebar: Organisasi & SDM) ───────────────────────────
  ac: ["view", "list", "create", "edit", "delete", "read", "update"],
  role: ["view", "list", "create", "edit", "delete", "read", "update"],
  employee: [
    "view",
    "list",
    "create",
    "edit",
    "delete",
    "sync-user",
    "unsync-user",
  ],
  user: [
    "view",
    "list",
    "create",
    "edit",
    "delete",
    "set-role",
    "ban",
    "impersonate",
    "set-password",
  ],
  department: ["view", "list", "create", "edit", "delete"],
  division: ["view", "list", "create", "edit", "delete"],
  team: ["view", "create", "update", "delete"],

  // ── Asset Management (Sidebar: Asset Management) ─────────────────────────

  /** Sidebar: Daftar Aset + Tambah Aset */
  asset: ["view", "list", "create", "edit", "delete", "export", "import"],

  /** Sidebar: Kategori Aset — hanya global-scope roles */
  "asset.category": ["view", "list", "create", "edit", "delete"],

  /** Sidebar: Lokasi Aset — hanya global-scope roles */
  "asset.location": ["view", "list", "create", "edit", "delete"],

  /** Sidebar: Peminjaman Aset */
  "asset.loan": ["view", "create", "return"],

  /** Sidebar: Maintenance Aset */
  "asset.maintenance": ["view", "create", "edit", "complete"],

  /** Sidebar: Mutasi Aset */
  "asset.transfer": [
    "view",
    "create",
    "approve",
    "complete",
    "cancel",
    "cross_department",
  ],

  /** Sidebar: Riwayat Aset */
  "asset.history": ["view"],

  // ── Inventory Control (Sidebar: Inventory Control) ───────────────────────

  /** Master Item, Kategori Item, Gudang, Stok, Penerimaan, Penyesuaian, Mutasi Stok */
  inventory: ["view", "create", "edit", "delete"],

  /** Sidebar: Permintaan Barang + Persetujuan Permintaan */
  "inventory.requisition": ["view", "create", "approve"],

  // ── Audit & Laporan (Sidebar: Audit & Laporan) ───────────────────────────

  /** Sidebar: Log Audit — hanya owner/admin */
  "audit.log": ["view"],

  /** Sidebar: Laporan — global-scope + manager/supervisor */
  report: ["view"],
} as const;

export const ac = createAccessControl(statement);

// =============================================================================
// BASE ROLES (system-level)
// =============================================================================

/** Owner — full access ke semua resource + org management */
export const owner = ac.newRole({
  // Org management
  ac: ["view", "list", "create", "edit", "delete", "read", "update"],
  role: ["view", "list", "create", "edit", "delete", "read", "update"],
  employee: [
    "view",
    "list",
    "create",
    "edit",
    "delete",
    "sync-user",
    "unsync-user",
  ],
  user: [
    "view",
    "list",
    "create",
    "edit",
    "delete",
    "set-role",
    "ban",
    "impersonate",
    "set-password",
  ],
  department: ["view", "list", "create", "edit", "delete"],
  division: ["view", "list", "create", "edit", "delete"],
  team: ["view", "create", "update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  organization: ["update", "delete"],

  // Asset Management — global scope
  asset: ["view", "list", "create", "edit", "delete", "export", "import"],
  "asset.category": ["view", "list", "create", "edit", "delete"],
  "asset.location": ["view", "list", "create", "edit", "delete"],
  "asset.loan": ["view", "create", "return"],
  "asset.maintenance": ["view", "create", "edit", "complete"],
  "asset.transfer": [
    "view",
    "create",
    "approve",
    "complete",
    "cancel",
    "cross_department",
  ],
  "asset.history": ["view"],

  // Inventory Control
  inventory: ["view", "create", "edit", "delete"],
  "inventory.requisition": ["view", "create", "approve"],

  // Audit & Laporan
  "audit.log": ["view"],
  report: ["view"],
});

/** Admin — full access kecuali delete org */
export const admin = ac.newRole({
  // Org management
  ac: ["view", "list", "create", "edit", "delete", "read", "update"],
  role: ["view", "list", "create", "edit", "delete", "read", "update"],
  employee: [
    "view",
    "list",
    "create",
    "edit",
    "delete",
    "sync-user",
    "unsync-user",
  ],
  user: [
    "view",
    "list",
    "create",
    "edit",
    "delete",
    "set-role",
    "ban",
    "impersonate",
    "set-password",
  ],
  department: ["view", "list", "create", "edit", "delete"],
  division: ["view", "list", "create", "edit", "delete"],
  team: ["view", "create", "update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  organization: ["update"], // tidak bisa delete org

  // Asset Management — global scope
  asset: ["view", "list", "create", "edit", "delete", "export", "import"],
  "asset.category": ["view", "list", "create", "edit", "delete"],
  "asset.location": ["view", "list", "create", "edit", "delete"],
  "asset.loan": ["view", "create", "return"],
  "asset.maintenance": ["view", "create", "edit", "complete"],
  "asset.transfer": [
    "view",
    "create",
    "approve",
    "complete",
    "cancel",
    "cross_department",
  ],
  "asset.history": ["view"],

  // Inventory Control
  inventory: ["view", "create", "edit", "delete"],
  "inventory.requisition": ["view", "create", "approve"],

  // Audit & Laporan
  "audit.log": ["view"],
  report: ["view"],
});

/** Member — read-only dasar */
export const member = ac.newRole({
  employee: ["view", "list"],
  department: ["view", "list"],
  division: ["view", "list"],
  asset: ["view", "list"],
  "asset.history": ["view"],
});

// =============================================================================
// JABATAN ROLES — disimpan ke DB via Dynamic Access Control (OrganizationRole)
// =============================================================================

/**
 * MANAGER
 * Sidebar visibility: Asset Management (full dept), Audit & Laporan (Laporan)
 * Scope: DEPARTMENT
 */
export const manager = ac.newRole({
  // SDM — read only
  employee: ["view", "list"],
  department: ["view", "list"],
  division: ["view", "list"],

  // Asset Management — dept scope, full control
  asset: ["view", "list", "create", "edit", "delete", "export"],
  "asset.loan": ["view", "create", "return"],
  "asset.maintenance": ["view", "create", "edit", "complete"],
  "asset.transfer": [
    "view",
    "create",
    "complete",
    "cancel",
    "cross_department",
  ],
  "asset.history": ["view"],

  // Laporan — bisa lihat report dept
  report: ["view"],
});

/**
 * SUPERVISOR
 * Sidebar visibility: Asset Management (terbatas dept), Audit & Laporan (Laporan)
 * Scope: DEPARTMENT
 */
export const supervisor = ac.newRole({
  // SDM — read only
  employee: ["view", "list"],
  department: ["view", "list"],
  division: ["view", "list"],

  // Asset Management — dept scope, tanpa delete
  asset: ["view", "list", "create", "edit", "export"],
  "asset.loan": ["view", "create", "return"],
  "asset.maintenance": ["view", "create", "edit", "complete"],
  "asset.transfer": ["view", "create", "complete", "cancel"],
  "asset.history": ["view"],

  // Laporan
  report: ["view"],
});

/**
 * STAFF LAPANGAN
 * Sidebar visibility: Asset Management (minimal dept)
 * Scope: DEPARTMENT
 */
export const staff_lapangan = ac.newRole({
  // SDM — read only
  employee: ["view", "list"],
  department: ["view", "list"],
  division: ["view", "list"],

  // Asset Management — dept scope, create only
  asset: ["view", "list", "create"],
  "asset.loan": ["view", "create"],
  "asset.maintenance": ["view", "create"],
  "asset.transfer": ["view", "create"],
  "asset.history": ["view"],
});

/**
 * STAFF ADMINISTRASI
 * Sidebar visibility: Asset Management (dept), Inventory Control
 * Scope: DEPARTMENT
 */

/**
 * FINANCE MANAGER
 * Sidebar visibility: Asset Management (read + approve), Laporan
 * Scope: GLOBAL
 */
export const finance_manager = ac.newRole({
  // SDM — read only
  employee: ["view", "list"],
  department: ["view", "list"],
  division: ["view", "list"],

  // Asset Management — global scope, read + approve only
  asset: ["view", "list", "export"],
  "asset.category": ["view", "list"],
  "asset.location": ["view", "list"],
  "asset.loan": ["view"],
  "asset.maintenance": ["view"],
  "asset.transfer": ["view", "approve", "cross_department"],
  "asset.history": ["view"],

  // Laporan
  report: ["view"],
});

/**
 * STAFF ASSET
 * Sidebar visibility: Asset Management (global full), Inventory Control
 * Scope: GLOBAL
 */
export const staff_asset = ac.newRole({
  // SDM — read only
  employee: ["view", "list"],
  department: ["view", "list"],
  division: ["view", "list"],

  // Asset Management — global scope, full CRUD
  asset: ["view", "list", "create", "edit", "delete", "export", "import"],
  "asset.category": ["view", "list", "create", "edit", "delete"],
  "asset.location": ["view", "list", "create", "edit", "delete"],
  "asset.loan": ["view", "create", "return"],
  "asset.maintenance": ["view", "create", "edit", "complete"],
  "asset.transfer": [
    "view",
    "create",
    "approve",
    "complete",
    "cancel",
    "cross_department",
  ],
  "asset.history": ["view"],

  // Inventory Control
  inventory: ["view", "create", "edit", "delete"],
  "inventory.requisition": ["view", "create", "approve"],

  // Laporan
  report: ["view"],
});
