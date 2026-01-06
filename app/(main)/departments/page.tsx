import { Main } from '@/components/main'
import { DialogProvider } from '@/context/dialog-provider'
import React from 'react'
import { DepartmentTable } from './components/dept-table'
import { Metadata } from 'next';
import DepartmentDialogs from './components/dept-dialog';
import DeptPrimaryButton from './components/dept-primary-buttons';
export const metadata: Metadata = {
    title: 'Departments',
    description: 'Halaman department',
};
export default function Departmentpage() {
    return (
        <DialogProvider>
            <Main fluid className='space-y-6'>
                <div className="flex flex-wrap items-end justify-between gap-2">

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Data Departemen
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pengelolaan data departemen
                        </p>
                    </div>
                    <DeptPrimaryButton />
                </div>
                <DepartmentTable />
            </Main>
            <DepartmentDialogs />
        </DialogProvider>
    )
}
