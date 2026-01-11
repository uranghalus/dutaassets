import React from 'react'
import { OrganizationTable } from './component/org-table'
import { Main } from '@/components/main'
import { DialogProvider } from '@/context/dialog-provider'
import OrgDialogs from './component/org-dialogs'
import OrgPrimaryButton from './component/org-primary-button'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Unit Bisnis',
    description: 'Halaman unit bisnis',
};
export default function OrganizationPage() {
    return (
        <DialogProvider>
            <Main fluid className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Unit Bisnis</h2>
                        <p className='text-muted-foreground'>
                            Kelola unit bisnis organisasi Anda di sini.
                        </p>
                    </div>
                    <OrgPrimaryButton />
                </div>
                <OrganizationTable />
            </Main>
            <OrgDialogs />
        </DialogProvider>
    )
}

