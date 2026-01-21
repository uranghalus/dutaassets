import React from 'react'
import { Main } from '@/components/main'
import { DialogProvider } from '@/context/dialog-provider'

import { Metadata } from 'next'
import { RolesTable } from './components/roles-table';
import OrgRoleDialogs from './components/roles-dialog';
import RolesPrimaryButton from './components/roles-primary-buttons';

export const metadata: Metadata = {
    title: 'Role & Permission',
    description: 'Halaman Role & Permission',
};
export default function OrganizationPage() {
    return (
        <DialogProvider>
            <Main fluid className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Role & Permission</h2>
                        <p className='text-muted-foreground'>
                            Kelola Role & Permission organisasi Anda di sini.
                        </p>
                    </div>
                    <RolesPrimaryButton />
                </div>
                <RolesTable />
            </Main>
            <OrgRoleDialogs />
        </DialogProvider>
    )
}

