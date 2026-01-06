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

    // ---------- ASSET ----------
    {
      title: 'Asset',
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
          url: '/asset-categories',
          icon: Tags,
        },
        {
          title: 'Lokasi Aset',
          url: '/asset-locations',
          icon: MapPin,
        },
      ],
    },

    // ---------- OPERASIONAL ----------
    {
      title: 'Operasional',
      items: [
        {
          title: 'Peminjaman Aset',
          url: '/asset-loans',
          icon: Handshake,
        },
        {
          title: 'Maintenance',
          url: '/maintenance',
          icon: Wrench,
        },
        {
          title: 'Mutasi Aset',
          url: '/asset-transfers',
          icon: Move,
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
