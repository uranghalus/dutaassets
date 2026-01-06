/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Name wajib diisi"),
    username: z.string().min(1, "Username wajib diisi"),
    email: z.string().email(),
});
export default function FormProfile() {
    const [loading, setLoading] = useState(false)
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            username: '',
            email: '',
        }
    })
    // Fetch session & autofill
    useEffect(() => {
        async function loadUser() {
            const session = await authClient.getSession();
            if (session?.data?.user) {
                form.reset({
                    name: session.data?.user.name ?? "",
                    username: session.data?.user.username ?? "",
                    email: session.data?.user.email ?? "",
                });
            }
        }
        loadUser();
    }, []);

    async function onSubmit(values: any) {
        setLoading(true);

        try {
            await toast.promise(
                async () => {
                    const updated = await authClient.updateUser({
                        name: values.name,
                        username: values.username,
                        image: null,
                    });

                    console.log("updated user:", updated.data);

                    return "User updated successfully";
                },
                {
                    loading: "Updating user...",
                    success: (message) => ({
                        message: "Berhasil!!",
                        description: message,
                    }),
                    error: (error) =>
                        error?.message || "Failed to update user",
                }
            );
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama lengkap" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="flex justify-start">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
