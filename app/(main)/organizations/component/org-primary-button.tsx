'use client'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/context/dialog-provider'
import { Plus } from 'lucide-react'
import React from 'react'

export default function OrgPrimaryButton() {
    const { setOpen } = useDialog()
    return (
        <div className='flex gap-2'>
            {/* <Button
              variant='outline'
              className='space-x-1'
              onClick={() => setOpen('invite')}
          >
              <span>Invite User</span> <MailPlus size={18} />
          </Button> */}
            <Button className='space-x-1' onClick={() => setOpen('add')}>
                <span>Tambah Data</span> <Plus size={18} />
            </Button>
        </div>
    )
}
