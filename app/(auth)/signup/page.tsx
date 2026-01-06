import { Metadata } from 'next'
import React from 'react'
import SignUpForm from './sign-up-form'
export const metadata: Metadata = {
    title: 'Daftar Pengguna'
}
export default function SignupPage() {
    return (
        <>
            <div className='flex flex-col space-y-2 text-start sm:px-4 px-4'>
                <h2 className='text-lg font-semibold tracking-tight'>Sign in</h2>
                <p className='text-muted-foreground text-sm'>
                    Masukkan email dan kata sandi Anda di bawah ini <br /> untuk masuk ke akun Anda
                </p>
            </div>

            <SignUpForm />
            <p className='text-muted-foreground px-8 text-center text-sm'>
                Dengan mengklik masuk, Anda menyetujui{' '}
                <a
                    href='/terms'
                    className='hover:text-primary underline underline-offset-4'
                >
                    Ketentuan Layanan
                </a>{' '}
                dan{' '}
                <a
                    href='/privacy'
                    className='hover:text-primary underline underline-offset-4 font-bold'
                >
                    Kebijakan Privasi
                </a>
                .
            </p>
        </>
    )
}
