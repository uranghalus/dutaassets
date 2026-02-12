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
} from 'lucide-react';

import { SidebarData } from '@/types';

export const sidebarData: SidebarData = {
  // ======================
  // APP INFO
  // ======================
  teams: [
    {
      name: 'DutaAsset',
      logo: Package,
      plan: 'v1.0.0',
    },
  ],

  // ======================
  // NAVIGATION
  // ======================
  navGroups: [
    // ---------- GENERAL ----------
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },

    // ---------- ASSET MANAGEMENT ----------
    {
      title: 'Asset Management',
      items: [
        {
          title: 'Daftar Aset',
          url: '/assets',
          icon: Boxes,
        },
        {
          title: 'Tambah Aset',
          url: '/assets/create',
          icon: Package,
        },
        {
          title: 'Kategori Aset',
          url: '/assets/categories',
          icon: Tags,
        },
        {
          title: 'Lokasi Aset',
          url: '/asset-locations',
          icon: MapPin,
        },
        {
          title: 'Peminjaman Aset',
          url: '/asset-loans',
          icon: Handshake,
        },
        {
          title: 'Maintenance Aset',
          url: '/assets/maintenances',
          icon: Wrench,
        },
        {
          title: 'Mutasi Aset',
          url: '/asset-transfers',
          icon: Move,
        },
        {
          title: 'Riwayat Aset',
          url: '/asset-history',
          icon: History,
        },
      ],
    },
    // ---------- INVENTORY CONTROL ----------
    {
      title: 'Inventory Control',
      items: [
        {
          title: 'Master Item',
          url: '/inventory/items',
          icon: Package,
        },
        {
          title: 'Kategori Item',
          url: '/inventory/categories',
          icon: Tags,
        },
        {
          title: 'Gudang',
          url: '/inventory/warehouses',
          icon: Warehouse,
        },
        {
          title: 'Requisition',
          icon: ClipboardList,
          items: [
            {
              title: 'Permintaan Barang',
              url: '/inventory/requisitions',
            },
            {
              title: 'Persetujuan Permintaan',
              url: '/inventory/requisition/approval',
            },
          ],
        },
        {
          title: 'Penerimaan Barang',
          url: '/inventory/receipts',
          icon: Truck,
        },
        {
          title: 'Penyesuaian Stok',
          url: '/inventory/adjustments',
          icon: ArrowDownUp,
        },
        {
          title: 'Mutasi Stok',
          url: '/inventory/transfers',
          icon: Move,
        },
        {
          title: 'Stok Barang',
          url: '/inventory/stocks',
          icon: Boxes,
        },
      ],
    },

    // ---------- AUDIT & LAPORAN ----------
    {
      title: 'Audit & Laporan',
      items: [
        {
          title: 'Riwayat Aset',
          url: '/asset-history',
          icon: History,
        },
        {
          title: 'Audit Log',
          url: '/audit-logs',
          icon: ShieldCheck,
        },
        {
          title: 'Laporan',
          url: '/reports',
          icon: FileText,
        },
      ],
    },

    // ---------- ORGANISASI & SDM ----------
    {
      title: 'Organisasi & SDM',
      items: [
        {
          title: 'Unit Bisnis',
          url: '/organizations',
          icon: Building2,
        },
        {
          title: 'Pengguna',
          url: '/users',
          icon: UserCog,
        },
        {
          title: 'Karyawan',
          url: '/employees',
          icon: Briefcase,
        },
        {
          title: 'Department',
          url: '/departments',
          icon: Layers,
        },
        {
          title: 'Divisi',
          url: '/divisions',
          icon: Building,
        },
        {
          title: 'Teams',
          icon: Users,
          items: [
            {
              title: 'Team List',
              url: '/teams',
            },
            {
              title: 'Team Members',
              url: '/teams/members',
            },
            {
              title: 'Permissions',
              url: '/teams/permissions',
            },
          ],
        },
        {
          title: 'Role & Permission',
          url: '/roles',
          icon: Key,
        },
      ],
    },

    // ---------- SETTINGS ----------
    {
      title: 'Settings',
      items: [
        {
          title: 'Profil Saya',
          url: '/settings/profile',
          icon: UserCircle,
        },
        {
          title: 'Preferensi',
          url: '/settings/preferences',
          icon: Sliders,
        },
        {
          title: 'Import / Export',
          url: '/settings/import-export',
          icon: Upload,
        },
      ],
    },
  ],
};
