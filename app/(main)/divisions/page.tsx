import { Main } from '@/components/main'
import { DialogProvider } from '@/context/dialog-provider'
import React from 'react'

export default function DivisionPage() {
    return (
        <DialogProvider>
            <Main fluid className='space-y-6'>
                <div className="flex flex-wrap items-end justify-between gap-2">

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Data Divisi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pengelolaan data divisi
                        </p>
                    </div>
                    {/* <DeptPrimaryButton /> */}
                </div>
                {/* <DepartmentTable /> */}
            </Main>
            {/* <DepartmentDialogs /> */}
        </DialogProvider>
    )
}
