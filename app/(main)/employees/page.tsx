import { Main } from '@/components/main'
import { DialogProvider } from '@/context/dialog-provider'
import React from 'react'
import { EmployeeTable } from './components/employees-table'
import EmployeeDialogs from './components/employees-dialogs'
import EmployeesPrimaryButton from './components/employees-primary-button'

export default function EmployeesPage() {
    return (
        <DialogProvider>
            <Main fluid className='space-y-6'>
                <div className="flex flex-wrap items-end justify-between gap-2">

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Data karyawan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pengelolaan data karyawan
                        </p>
                    </div>
                    <EmployeesPrimaryButton />
                </div>
                <EmployeeTable />
            </Main>
            <EmployeeDialogs />
        </DialogProvider>
    )
}
