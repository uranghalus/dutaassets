'use client'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const formSchema = z
    .object({
        name: z.string().min(1, 'Please enter your name'),
        email: z.email({
            error: (iss) =>
                iss.input === '' ? 'Please enter your email' : undefined,
        }),
        password: z
            .string()
            .min(1, 'Please enter your password')
            .min(7, 'Password must be at least 7 characters long'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        role: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'],
    })
type SignupValues = z.infer<typeof formSchema>
export default function SignUpForm({
    className,
    ...props
}: React.HTMLAttributes<HTMLFormElement>) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    async function onSubmit({ email, password, name }: SignupValues) {

        const { data } = await authClient.signUp.email({
            email, // user email address
            password, // user password -> min 8 characters by default
            name, // user display name
            callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)
        }, {
            onRequest: (ctx) => {
                setIsLoading(true)
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
                setTimeout(() => {
                    setIsLoading(false)
                }, 3000)
            },
            onError: (ctx) => {
                // display the error message
                alert(ctx.error.message);
            },
        });
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('grid gap-3 px-4', className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='John Doe' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder='name@example.com' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder='********' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder='********' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='mt-2' disabled={isLoading}>
                    Create Account
                </Button>

                <div className='relative my-2'>
                    <div className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                        <span className='bg-background text-muted-foreground px-2'>
                            Or continue with
                        </span>
                    </div>
                </div>
            </form>
        </Form>
    )
}
