import { Main } from '@/components/main'
import { DialogProvider } from '@/context/dialog-provider'
import React from 'react'
import { UserTable } from './components/user-table'
import UserDialogs from './components/user-dialogs'
import UsersPrimaryButton from './components/users-primary-button'

export default function UsersPage() {
    return (
        <DialogProvider>
            <Main fluid className='space-y-6'>
                <div className="flex flex-wrap items-end justify-between gap-2">

                    <div>
                        <h1 className="text-2xl font-semibold">
                            User Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage users and their access roles.
                        </p>
                    </div>
                    <UsersPrimaryButton />
                </div>
                <UserTable />
            </Main>
            <UserDialogs />
        </DialogProvider>
    )
}
