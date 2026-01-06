'use client'
import { LoginSchema } from '@/schema/auth-schema'
import { ActionState } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Button } from './ui/button'

import { Input } from './ui/input'
import Link from 'next/link'
import { PasswordInput } from './password-input'
import { Checkbox } from '@radix-ui/react-checkbox'
import { AlertCircleIcon, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { loginAction } from '@/action/auth-action'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirect = searchParams.get("redirect");
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false

        },
    })
    useEffect(() => {
        form.clearErrors("root");
    }, [form.watch("email"), form.watch("password")]);
    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setIsLoading(true);
        try {
            const res = await loginAction(values);
            console.log(res);

            // ❌ ERROR DARI SERVER
            if (res.status === "error") {
                if (res.fieldErrors?.email) {
                    form.setError("email", {
                        type: "server",
                        message: res.fieldErrors.email,
                    });
                }

                if (res.fieldErrors?.password) {
                    form.setError("password", {
                        type: "server",
                        message: res.fieldErrors.password,
                    });
                }

                if (res.message) {
                    form.setError("root", {
                        type: "server",
                        message: res.message,
                    });
                }

                return;
            }

            // ✅ SUCCESS
            toast.success("Berhasil login", {
                description: res.message,
            });

            router.push(redirect ?? "/dashboard");
        } catch {
            form.setError("root", {
                type: "server",
                message: "Terjadi kesalahan server",
            });
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:px-4 px-4 ">

                {form.formState.errors.root?.message && (
                    <Alert variant="destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertTitle>Oops, login gagal</AlertTitle>
                        <AlertDescription>
                            {form.formState.errors.root.message}
                        </AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center">
                                <FormLabel>Password</FormLabel>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <FormControl>
                                <PasswordInput
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Remember me</FormLabel>
                        </FormItem>
                    )}
                />


                <Button type="submit" className="w-full" disabled={isLoading}>
                    Login
                    <LoaderCircle className='me-2 animate-spin' style={{ display: isLoading ? 'inline-block' : 'none' }} />
                </Button>

                {/* <div className="flex w-full flex-col items-center justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        disabled={loading}
                        onClick={() => handleSocialSignIn("google")}
                    >
                        <GoogleIcon width="0.98em" height="1em" />
                        Sign in with Google
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        disabled={loading}
                        onClick={() => handleSocialSignIn("github")}
                    >
                        <GitHubIcon />
                        Sign in with Github
                    </Button>
                </div> */}
            </form>
        </Form>
    )
}
