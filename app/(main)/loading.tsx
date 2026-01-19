import React from 'react'

export default function Loading() {
    return (
        <div className='flex min-h-svh items-center justify-center p-6'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900'></div>
        </div>
    )
}
