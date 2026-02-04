'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/context/dialog-provider'

export default function UsersPrimaryButton() {
    const { setOpen, setCurrentRow } = useDialog()

    return (
        <Button
            size="sm"
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
            className="gap-2"
        >
            <Plus className="h-4 w-4" />
            Add User
        </Button>
    )
}
